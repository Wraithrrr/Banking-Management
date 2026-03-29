import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity'
import { VaultBalance } from './entities/vault-balance.entity'
import { AccountsService } from '../accounts/accounts.service'
import { DepositDto, WithdrawalDto, TransferDto } from './dto/transaction.dto'
import { AuditLogService } from '../audit-log/audit-log.service'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationType } from '../notifications/entities/notification.entity'

const DAILY_LIMIT = 1_000_000 // ₦1,000,000 requires approval

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(VaultBalance)
    private vaultRepository: Repository<VaultBalance>,
    private accountsService: AccountsService,
    private dataSource: DataSource,
    private auditLogService: AuditLogService,
    private notificationsService: NotificationsService,
  ) {}

  private generateRef(): string {
    const ts = Date.now().toString(36).toUpperCase()
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `TXN-${ts}-${rand}`
  }

  private todayString(): string {
    return new Date().toISOString().split('T')[0]
  }

  private async getOrCreateVault(branchId: number, bankId: number): Promise<VaultBalance> {
    const date = this.todayString()
    let vault = await this.vaultRepository.findOne({ where: { branchId, bankId, date } })
    if (!vault) {
      vault = this.vaultRepository.create({ branchId, bankId, date })
      vault = await this.vaultRepository.save(vault)
    }
    return vault
  }

  private async updateVault(branchId: number, bankId: number, type: TransactionType, amount: number): Promise<void> {
    const vault = await this.getOrCreateVault(branchId, bankId)
    const deposits = parseFloat(vault.totalDeposits)
    const withdrawals = parseFloat(vault.totalWithdrawals)
    const opening = parseFloat(vault.openingBalance)

    const newDeposits = type === TransactionType.DEPOSIT ? deposits + amount : deposits
    const newWithdrawals = type === TransactionType.WITHDRAWAL ? withdrawals + amount : withdrawals
    const newClosing = opening + newDeposits - newWithdrawals

    await this.vaultRepository.update(vault.id, {
      totalDeposits: newDeposits.toFixed(2),
      totalWithdrawals: newWithdrawals.toFixed(2),
      closingBalance: newClosing.toFixed(2),
    })
  }

  // ── Deposit ───────────────────────────────────────────────────────────────
  async deposit(dto: DepositDto, actor: { userId: number; bankId: number; branchId?: number }) {
    const account = await this.accountsService.findByAccountNumber(dto.accountNumber, actor)
    const requiresApproval = dto.amount > DAILY_LIMIT
    const status = requiresApproval ? TransactionStatus.PENDING_APPROVAL : TransactionStatus.COMPLETED

    const txn = this.transactionsRepository.create({
      reference: this.generateRef(),
      type: TransactionType.DEPOSIT,
      amount: dto.amount.toFixed(2),
      narration: dto.narration ?? 'Cash Deposit',
      toAccountId: account.id,
      tellerUserId: actor.userId,
      branchId: actor.branchId ?? 0,
      bankId: actor.bankId,
      status,
      requiresApproval,
    })
    await this.transactionsRepository.save(txn)

    if (status === TransactionStatus.COMPLETED) {
      const newBalance = parseFloat(account.balance) + dto.amount
      await this.accountsService.updateBalance(account.id, newBalance)
      await this.updateVault(actor.branchId ?? 0, actor.bankId, TransactionType.DEPOSIT, dto.amount)
    }

    if (requiresApproval) {
      this.notificationsService.notifyRole({
        role: 'head-operations', bankId: actor.bankId,
        type: NotificationType.TRANSACTION_APPROVAL,
        message: `Large deposit of ₦${dto.amount.toLocaleString()} requires your approval (Ref: ${txn.reference}).`,
        relatedEntityId: txn.id, relatedEntityType: 'transaction',
      })
    }
    return { ...txn, requiresApproval, message: requiresApproval ? 'Transaction queued for Head of Operations approval (amount exceeds ₦1,000,000).' : 'Deposit successful.' }
  }

  // ── Withdrawal ────────────────────────────────────────────────────────────
  async withdrawal(dto: WithdrawalDto, actor: { userId: number; bankId: number; branchId?: number }) {
    const account = await this.accountsService.findByAccountNumber(dto.accountNumber, actor)
    const balance = parseFloat(account.balance)
    if (balance < dto.amount) {
      throw new BadRequestException(`Insufficient balance. Available: ₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`)
    }

    const requiresApproval = dto.amount > DAILY_LIMIT
    const status = requiresApproval ? TransactionStatus.PENDING_APPROVAL : TransactionStatus.COMPLETED

    const txn = this.transactionsRepository.create({
      reference: this.generateRef(),
      type: TransactionType.WITHDRAWAL,
      amount: dto.amount.toFixed(2),
      narration: dto.narration ?? 'Cash Withdrawal',
      fromAccountId: account.id,
      tellerUserId: actor.userId,
      branchId: actor.branchId ?? 0,
      bankId: actor.bankId,
      status,
      requiresApproval,
    })
    await this.transactionsRepository.save(txn)

    if (status === TransactionStatus.COMPLETED) {
      await this.accountsService.updateBalance(account.id, balance - dto.amount)
      await this.updateVault(actor.branchId ?? 0, actor.bankId, TransactionType.WITHDRAWAL, dto.amount)
    }

    if (requiresApproval) {
      this.notificationsService.notifyRole({
        role: 'head-operations', bankId: actor.bankId,
        type: NotificationType.TRANSACTION_APPROVAL,
        message: `Large withdrawal of ₦${dto.amount.toLocaleString()} requires your approval (Ref: ${txn.reference}).`,
        relatedEntityId: txn.id, relatedEntityType: 'transaction',
      })
    }
    return { ...txn, requiresApproval, message: requiresApproval ? 'Transaction queued for approval.' : 'Withdrawal successful.' }
  }

  // ── Transfer ──────────────────────────────────────────────────────────────
  async transfer(dto: TransferDto, actor: { userId: number; bankId: number; branchId?: number }) {
    if (dto.fromAccountNumber === dto.toAccountNumber) {
      throw new BadRequestException('Cannot transfer to the same account.')
    }

    const fromAccount = await this.accountsService.findByAccountNumber(dto.fromAccountNumber, actor)
    const toAccount = await this.accountsService.findByAccountNumber(dto.toAccountNumber, actor)
    const balance = parseFloat(fromAccount.balance)

    if (balance < dto.amount) {
      throw new BadRequestException(`Insufficient balance. Available: ₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`)
    }

    const requiresApproval = dto.amount > DAILY_LIMIT
    const status = requiresApproval ? TransactionStatus.PENDING_APPROVAL : TransactionStatus.COMPLETED

    // Use a DB transaction for atomic debit + credit
    await this.dataSource.transaction(async (manager) => {
      const txn = manager.create(Transaction, {
        reference: this.generateRef(),
        type: TransactionType.TRANSFER,
        amount: dto.amount.toFixed(2),
        narration: dto.narration ?? `Transfer to ${dto.toAccountNumber}`,
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        tellerUserId: actor.userId,
        branchId: actor.branchId ?? 0,
        bankId: actor.bankId,
        status,
        requiresApproval,
      })
      await manager.save(txn)

      if (status === TransactionStatus.COMPLETED) {
        await manager.update('accounts', { id: fromAccount.id }, { balance: (balance - dto.amount).toFixed(2) })
        await manager.update('accounts', { id: toAccount.id }, { balance: (parseFloat(toAccount.balance) + dto.amount).toFixed(2) })
      }
    })

    if (requiresApproval) {
      this.notificationsService.notifyRole({
        role: 'head-operations', bankId: actor.bankId,
        type: NotificationType.TRANSACTION_APPROVAL,
        message: `Large transfer of ₦${dto.amount.toLocaleString()} requires your approval.`,
        relatedEntityType: 'transaction',
      })
    }
    return { requiresApproval, message: requiresApproval ? 'Transfer queued for approval.' : 'Transfer successful.' }
  }

  // ── Approve pending transaction ───────────────────────────────────────────
  async approve(txnId: number, actor: { userId: number; bankId: number; role: string; name?: string }) {
    if (actor.role !== 'head-operations') {
      throw new ForbiddenException('Only Head of Operations can approve transactions.')
    }

    const txn = await this.transactionsRepository.findOne({
      where: { id: txnId, bankId: actor.bankId, status: TransactionStatus.PENDING_APPROVAL },
    })
    if (!txn) throw new NotFoundException('Pending transaction not found.')

    const amount = parseFloat(txn.amount)

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Transaction, { id: txnId }, {
        status: TransactionStatus.APPROVED,
        approvedById: actor.userId,
      })

      if (txn.type === TransactionType.DEPOSIT && txn.toAccountId) {
        const acc = await this.accountsService.findById(txn.toAccountId, actor)
        await manager.update('accounts', { id: acc.id }, { balance: (parseFloat(acc.balance) + amount).toFixed(2) })
        await this.updateVault(txn.branchId, txn.bankId, TransactionType.DEPOSIT, amount)
      }
      if (txn.type === TransactionType.WITHDRAWAL && txn.fromAccountId) {
        const acc = await this.accountsService.findById(txn.fromAccountId, actor)
        await manager.update('accounts', { id: acc.id }, { balance: (parseFloat(acc.balance) - amount).toFixed(2) })
        await this.updateVault(txn.branchId, txn.bankId, TransactionType.WITHDRAWAL, amount)
      }
      if (txn.type === TransactionType.TRANSFER && txn.fromAccountId && txn.toAccountId) {
        const from = await this.accountsService.findById(txn.fromAccountId, actor)
        const to = await this.accountsService.findById(txn.toAccountId, actor)
        await manager.update('accounts', { id: from.id }, { balance: (parseFloat(from.balance) - amount).toFixed(2) })
        await manager.update('accounts', { id: to.id }, { balance: (parseFloat(to.balance) + amount).toFixed(2) })
      }
    })

    try {
      await this.auditLogService.log({
        action: 'TRANSACTION_APPROVED',
        entityType: 'transaction',
        entityId: txnId,
        actorId: actor.userId,
        actorRole: actor.role,
        actorName: actor.name ?? 'Head of Operations',
        description: `Transaction #${txn.reference} approved — ₦${txn.amount} (${txn.type})`,
        bankId: actor.bankId,
        branchId: txn.branchId ?? null,
      })
    } catch (_) {}

    return { message: 'Transaction approved and posted.' }
  }

  // ── Decline pending transaction ───────────────────────────────────────────
  async decline(txnId: number, actor: { userId: number; bankId: number; role: string; name?: string }) {
    if (actor.role !== 'head-operations') {
      throw new ForbiddenException('Only Head of Operations can decline transactions.')
    }

    const txn = await this.transactionsRepository.findOne({
      where: { id: txnId, bankId: actor.bankId, status: TransactionStatus.PENDING_APPROVAL },
    })
    if (!txn) throw new NotFoundException('Pending transaction not found.')

    await this.transactionsRepository.update(txnId, {
      status: TransactionStatus.REJECTED,
      approvedById: actor.userId,
    })

    try {
      await this.auditLogService.log({
        action: 'TRANSACTION_DECLINED',
        entityType: 'transaction',
        entityId: txnId,
        actorId: actor.userId,
        actorRole: actor.role,
        actorName: actor.name ?? 'Head of Operations',
        description: `Transaction #${txn.reference} declined — ₦${txn.amount} (${txn.type})`,
        bankId: actor.bankId,
        branchId: txn.branchId ?? null,
      })
    } catch (_) {}

    return { message: 'Transaction declined.' }
  }

  // ── List transactions ─────────────────────────────────────────────────────
  async findAll(actor: { bankId: number; branchId?: number; role: string }, filters?: {
    status?: string; type?: string; date?: string; accountNumber?: string
  }) {
    const query = this.transactionsRepository
      .createQueryBuilder('txn')
      .leftJoinAndSelect('txn.fromAccount', 'fromAcc')
      .leftJoinAndSelect('txn.toAccount', 'toAcc')
      .where('txn.bankId = :bankId', { bankId: actor.bankId })
      .orderBy('txn.createdAt', 'DESC')
      .take(200)

    // Branch-scoped roles only see their branch
    if (actor.branchId && ['branch-manager', 'teller'].includes(actor.role)) {
      query.andWhere('txn.branchId = :branchId', { branchId: actor.branchId })
    }

    if (filters?.status) query.andWhere('txn.status = :status', { status: filters.status })
    if (filters?.type) query.andWhere('txn.type = :type', { type: filters.type })
    if (filters?.date) query.andWhere('DATE(txn.createdAt) = :date', { date: filters.date })

    return query.getMany()
  }

  // ── Vault summary ─────────────────────────────────────────────────────────
  async getVault(actor: { bankId: number; branchId?: number }): Promise<VaultBalance | null> {
    if (!actor.branchId) return null
    return this.getOrCreateVault(actor.branchId, actor.bankId)
  }

  async getAllVaults(actor: { bankId: number }): Promise<VaultBalance[]> {
    const date = this.todayString()
    return this.vaultRepository.find({ where: { bankId: actor.bankId, date } })
  }

  // ── Pending approvals ─────────────────────────────────────────────────────
  async getPending(actor: { bankId: number }): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { bankId: actor.bankId, status: TransactionStatus.PENDING_APPROVAL },
      order: { createdAt: 'ASC' },
    })
  }
}
