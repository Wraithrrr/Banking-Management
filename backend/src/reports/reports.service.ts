import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction, TransactionType } from '../transactions/entities/transaction.entity'
import { VaultBalance } from '../transactions/entities/vault-balance.entity'
import { LoanApplication, LoanStatus } from '../loans/entities/loan-application.entity'
import { Account } from '../accounts/entities/account.entity'

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
    @InjectRepository(VaultBalance) private vaultRepo: Repository<VaultBalance>,
    @InjectRepository(LoanApplication) private loanRepo: Repository<LoanApplication>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
  ) {}

  async dailyTransactionSummary(actor: { bankId: number }, date?: string) {
    const reportDate = date ?? new Date().toISOString().split('T')[0]
    const txns = await this.txnRepo
      .createQueryBuilder('t')
      .where('t.bankId = :bankId AND DATE(t.createdAt) = :date', { bankId: actor.bankId, date: reportDate })
      .getMany()

    const deposits = txns.filter(t => t.type === TransactionType.DEPOSIT)
    const withdrawals = txns.filter(t => t.type === TransactionType.WITHDRAWAL)
    const transfers = txns.filter(t => t.type === TransactionType.TRANSFER)

    const vaults = await this.vaultRepo.find({ where: { bankId: actor.bankId, date: reportDate } })

    return {
      date: reportDate,
      totalTransactions: txns.length,
      totalDeposits: deposits.reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2),
      totalWithdrawals: withdrawals.reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2),
      totalTransfers: transfers.reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2),
      depositCount: deposits.length,
      withdrawalCount: withdrawals.length,
      transferCount: transfers.length,
      branchVaults: vaults,
    }
  }

  async loanPortfolio(actor: { bankId: number }) {
    const loans = await this.loanRepo.find({ where: { bankId: actor.bankId } })
    const byType: Record<string, { count: number; totalAmount: number }> = {}
    loans.forEach(l => {
      if (!byType[l.type]) byType[l.type] = { count: 0, totalAmount: 0 }
      byType[l.type].count++
      byType[l.type].totalAmount += parseFloat(l.amount)
    })

    const disbursed = loans.filter(l => l.status === LoanStatus.DISBURSED)
    const totalDisbursed = disbursed.reduce((s, l) => s + parseFloat(l.amount), 0)

    return {
      total: loans.length,
      byStatus: {
        pending: loans.filter(l => [LoanStatus.PENDING_BM, LoanStatus.PENDING_HOC].includes(l.status)).length,
        approved: loans.filter(l => l.status === LoanStatus.APPROVED).length,
        disbursed: disbursed.length,
        declined: loans.filter(l => l.status === LoanStatus.DECLINED).length,
      },
      byType,
      totalDisbursedAmount: totalDisbursed.toFixed(2),
    }
  }

  async accountStatement(accountNumber: string, actor: { bankId: number }, fromDate?: string, toDate?: string) {
    const account = await this.accountRepo.findOne({
      where: { accountNumber, bankId: actor.bankId },
      relations: ['customer'],
    })
    if (!account) return null

    const query = this.txnRepo.createQueryBuilder('t')
      .where('t.bankId = :bankId AND (t.fromAccountId = :id OR t.toAccountId = :id)', {
        bankId: actor.bankId, id: account.id,
      })
      .orderBy('t.createdAt', 'ASC')

    if (fromDate) query.andWhere('DATE(t.createdAt) >= :from', { from: fromDate })
    if (toDate) query.andWhere('DATE(t.createdAt) <= :to', { to: toDate })

    const transactions = await query.getMany()

    return {
      account: {
        accountNumber: account.accountNumber,
        type: account.type,
        balance: account.balance,
        customerName: account.customer ? `${account.customer.firstName} ${account.customer.lastName}` : 'N/A',
      },
      transactions,
      generatedAt: new Date().toISOString(),
    }
  }
}
