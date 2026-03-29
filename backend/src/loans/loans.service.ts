import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoanApplication, LoanStatus } from './entities/loan-application.entity'
import { LoanRepayment, RepaymentStatus } from './entities/loan-repayment.entity'
import { CreateLoanDto, DecisionDto } from './dto/loan.dto'
import { AuditLogService } from '../audit-log/audit-log.service'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationType } from '../notifications/entities/notification.entity'

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(LoanApplication)
    private loansRepository: Repository<LoanApplication>,
    @InjectRepository(LoanRepayment)
    private repaymentsRepository: Repository<LoanRepayment>,
    private auditLogService: AuditLogService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateLoanDto, actor: { userId: number; bankId: number; branchId?: number }): Promise<LoanApplication> {
    const loan = this.loansRepository.create({
      ...dto,
      amount: dto.amount.toFixed(2),
      status: LoanStatus.PENDING_BM,
      creditOfficerId: actor.userId,
      branchId: actor.branchId ?? null,
      bankId: actor.bankId,
    })
    const saved = await this.loansRepository.save(loan)
    // Notify branch manager(s) in this branch
    this.notificationsService.notifyRole({
      role: 'branch-manager', bankId: actor.bankId, branchId: actor.branchId,
      type: NotificationType.LOAN_UPDATE,
      message: `New loan application from ${dto.customerName} — ₦${Number(dto.amount).toLocaleString()} awaiting your review.`,
      relatedEntityId: saved.id, relatedEntityType: 'loan',
    })
    return saved
  }

  async findAll(actor: { userId: number; bankId: number; branchId?: number; role: string }): Promise<LoanApplication[]> {
    const query = this.loansRepository.createQueryBuilder('loan')
      .where('loan.bankId = :bankId', { bankId: actor.bankId })
      .orderBy('loan.createdAt', 'DESC')
      .take(200)

    // Credit officer sees only their own
    if (actor.role === 'credit-officer') {
      query.andWhere('loan.creditOfficerId = :userId', { userId: actor.userId })
    }
    // Branch manager sees their branch
    if (actor.role === 'branch-manager' && actor.branchId) {
      query.andWhere('loan.branchId = :branchId AND loan.status IN (:...statuses)', {
        branchId: actor.branchId,
        statuses: [LoanStatus.PENDING_BM, LoanStatus.PENDING_HOC, LoanStatus.APPROVED, LoanStatus.DECLINED, LoanStatus.DISBURSED],
      })
    }

    return query.getMany()
  }

  async findOne(id: number, actor: { bankId: number }): Promise<LoanApplication> {
    const loan = await this.loansRepository.findOne({ where: { id, bankId: actor.bankId } })
    if (!loan) throw new NotFoundException('Loan application not found.')
    return loan
  }

  async bmDecision(id: number, approve: boolean, dto: DecisionDto, actor: { userId: number; bankId: number; role: string; name?: string; branchId?: number }): Promise<LoanApplication> {
    if (actor.role !== 'branch-manager') throw new ForbiddenException('Only Branch Manager can make this decision.')
    const loan = await this.findOne(id, actor)
    if (loan.status !== LoanStatus.PENDING_BM) throw new ForbiddenException('Loan is not pending Branch Manager review.')

    const update: Partial<LoanApplication> = {
      branchManagerId: actor.userId,
      status: approve ? LoanStatus.PENDING_HOC : LoanStatus.DECLINED,
      declineReason: approve ? null : (dto.declineReason ?? 'Declined by Branch Manager'),
    }
    await this.loansRepository.update(id, update)

    if (approve) {
      try {
        await this.auditLogService.log({
          action: 'LOAN_APPROVED_BM',
          entityType: 'loan',
          entityId: loan.id,
          actorId: actor.userId,
          actorRole: actor.role,
          actorName: actor.name ?? 'Branch Manager',
          description: `Branch Manager approved loan for ${loan.customerName} — ₦${loan.amount}`,
          bankId: actor.bankId,
          branchId: actor.branchId ?? null,
        })
      } catch (_) {}
    } else {
      try {
        await this.auditLogService.log({
          action: 'LOAN_DECLINED_BM',
          entityType: 'loan',
          entityId: loan.id,
          actorId: actor.userId,
          actorRole: actor.role,
          actorName: actor.name ?? 'Branch Manager',
          description: `Branch Manager declined loan for ${loan.customerName} — ₦${loan.amount}. Reason: ${update.declineReason}`,
          bankId: actor.bankId,
          branchId: actor.branchId ?? null,
        })
      } catch (_) {}
    }

    // Notify next step in pipeline
    if (approve) {
      this.notificationsService.notifyRole({
        role: 'head-credit', bankId: actor.bankId,
        type: NotificationType.LOAN_UPDATE,
        message: `Loan for ${loan.customerName} (₦${Number(loan.amount).toLocaleString()}) approved by Branch Manager — awaiting your decision.`,
        relatedEntityId: loan.id, relatedEntityType: 'loan',
      })
    } else {
      this.notificationsService.notifyRole({
        role: 'credit-officer', bankId: actor.bankId, branchId: actor.branchId,
        type: NotificationType.LOAN_UPDATE,
        message: `Loan for ${loan.customerName} was declined by Branch Manager. Reason: ${update.declineReason}`,
        relatedEntityId: loan.id, relatedEntityType: 'loan',
      })
    }

    return { ...loan, ...update }
  }

  async hocDecision(id: number, approve: boolean, dto: DecisionDto, actor: { userId: number; bankId: number; role: string; name?: string; branchId?: number }): Promise<LoanApplication> {
    if (actor.role !== 'head-credit') throw new ForbiddenException('Only Head of Credit can make this decision.')
    const loan = await this.findOne(id, actor)
    if (loan.status !== LoanStatus.PENDING_HOC) throw new ForbiddenException('Loan is not pending Head of Credit review.')

    const update: Partial<LoanApplication> = {
      headCreditId: actor.userId,
      status: approve ? LoanStatus.APPROVED : LoanStatus.DECLINED,
      declineReason: approve ? null : (dto.declineReason ?? 'Declined by Head of Credit'),
    }
    await this.loansRepository.update(id, update)

    if (approve) {
      try {
        await this.auditLogService.log({
          action: 'LOAN_APPROVED_HOC',
          entityType: 'loan',
          entityId: loan.id,
          actorId: actor.userId,
          actorRole: actor.role,
          actorName: actor.name ?? 'Head of Credit',
          description: `Head of Credit approved loan for ${loan.customerName} — ₦${loan.amount}`,
          bankId: actor.bankId,
          branchId: actor.branchId ?? null,
        })
      } catch (_) {}
    } else {
      try {
        await this.auditLogService.log({
          action: 'LOAN_DECLINED_HOC',
          entityType: 'loan',
          entityId: loan.id,
          actorId: actor.userId,
          actorRole: actor.role,
          actorName: actor.name ?? 'Head of Credit',
          description: `Head of Credit declined loan for ${loan.customerName} — ₦${loan.amount}. Reason: ${update.declineReason}`,
          bankId: actor.bankId,
          branchId: actor.branchId ?? null,
        })
      } catch (_) {}
    }

    // Notify next step in pipeline
    if (approve) {
      this.notificationsService.notifyRole({
        role: 'teller', bankId: actor.bankId, branchId: loan.branchId,
        type: NotificationType.LOAN_UPDATE,
        message: `Loan for ${loan.customerName} (₦${Number(loan.amount).toLocaleString()}) is fully approved — ready for disbursement.`,
        relatedEntityId: loan.id, relatedEntityType: 'loan',
      })
    } else {
      this.notificationsService.notifyRole({
        role: 'credit-officer', bankId: actor.bankId,
        type: NotificationType.LOAN_UPDATE,
        message: `Loan for ${loan.customerName} was declined by Head of Credit. Reason: ${update.declineReason}`,
        relatedEntityId: loan.id, relatedEntityType: 'loan',
      })
    }

    return { ...loan, ...update }
  }

  async disburse(id: number, actor: { userId: number; bankId: number; role: string; name?: string; branchId?: number }): Promise<LoanApplication> {
    if (actor.role !== 'teller') throw new ForbiddenException('Only Teller can disburse loans.')
    const loan = await this.findOne(id, actor)
    if (loan.status !== LoanStatus.APPROVED) throw new ForbiddenException('Loan must be fully approved before disbursement.')
    await this.loansRepository.update(id, { status: LoanStatus.DISBURSED })

    // Auto-generate monthly repayment schedule
    const monthlyPayment = (parseFloat(loan.amount) * (1 + parseFloat(loan.interestRate) / 100)) / loan.termMonths
    const repayments: Partial<LoanRepayment>[] = []
    for (let i = 1; i <= loan.termMonths; i++) {
      const due = new Date()
      due.setMonth(due.getMonth() + i)
      repayments.push({
        loanId: id,
        dueDate: due.toISOString().split('T')[0],
        amount: monthlyPayment.toFixed(2),
        status: RepaymentStatus.PENDING,
      })
    }
    await this.repaymentsRepository.save(repayments)

    try {
      await this.auditLogService.log({
        action: 'LOAN_DISBURSED',
        entityType: 'loan',
        entityId: loan.id,
        actorId: actor.userId,
        actorRole: actor.role,
        actorName: actor.name ?? 'Teller',
        description: `Loan disbursed for ${loan.customerName} — ₦${loan.amount}`,
        bankId: actor.bankId,
        branchId: actor.branchId ?? null,
      })
    } catch (_) {}

    return { ...loan, status: LoanStatus.DISBURSED }
  }

  async getRepayments(loanId: number, actor: { bankId: number }): Promise<LoanRepayment[]> {
    await this.findOne(loanId, actor) // verifies loan belongs to this bank
    return this.repaymentsRepository.find({
      where: { loanId },
      order: { dueDate: 'ASC' },
    })
  }

  async recordPayment(repaymentId: number, amount: number, actor: { userId: number; bankId: number; role: string; name?: string; branchId?: number }): Promise<LoanRepayment> {
    if (actor.role !== 'teller') throw new ForbiddenException('Only Teller can record repayments.')
    const repayment = await this.repaymentsRepository.findOne({ where: { id: repaymentId } })
    if (!repayment) throw new NotFoundException('Repayment record not found.')
    if (repayment.status === RepaymentStatus.PAID) throw new ForbiddenException('This installment is already paid.')

    // Verify the loan belongs to this bank
    await this.findOne(repayment.loanId, actor)

    const due = parseFloat(repayment.amount)
    const paid = parseFloat(repayment.paidAmount ?? '0') + amount
    const newStatus = paid >= due ? RepaymentStatus.PAID : RepaymentStatus.PENDING

    await this.repaymentsRepository.update(repaymentId, {
      paidAmount: paid.toFixed(2),
      status: newStatus,
      paidAt: newStatus === RepaymentStatus.PAID ? new Date() : null,
    })

    try {
      await this.auditLogService.log({
        action: 'REPAYMENT_RECORDED',
        entityType: 'repayment',
        entityId: repaymentId,
        actorId: actor.userId,
        actorRole: actor.role,
        actorName: actor.name ?? 'Teller',
        description: `Repayment of ₦${amount.toLocaleString()} recorded for loan #${repayment.loanId} — installment ${newStatus === RepaymentStatus.PAID ? 'fully paid' : 'partially paid'}`,
        bankId: actor.bankId,
        branchId: actor.branchId ?? null,
      })
    } catch (_) {}

    return { ...repayment, paidAmount: paid.toFixed(2), status: newStatus }
  }

  async getOverdueRepayments(actor: { bankId: number }): Promise<LoanRepayment[]> {
    const today = new Date().toISOString().split('T')[0]
    // Mark any pending repayments past due date as overdue
    await this.repaymentsRepository
      .createQueryBuilder()
      .update(LoanRepayment)
      .set({ status: RepaymentStatus.OVERDUE })
      .where('status = :s AND dueDate < :today', { s: RepaymentStatus.PENDING, today })
      .execute()

    return this.repaymentsRepository
      .createQueryBuilder('r')
      .innerJoin('r.loan', 'l')
      .where('l.bankId = :bankId AND r.status = :status', { bankId: actor.bankId, status: RepaymentStatus.OVERDUE })
      .orderBy('r.dueDate', 'ASC')
      .getMany()
  }

  async getPortfolioSummary(actor: { bankId: number }) {
    const loans = await this.loansRepository.find({ where: { bankId: actor.bankId } })
    const repayments = await this.repaymentsRepository
      .createQueryBuilder('r')
      .innerJoin('r.loan', 'l')
      .where('l.bankId = :bankId', { bankId: actor.bankId })
      .getMany()

    const disbursed = loans.filter(l => l.status === LoanStatus.DISBURSED)
    const totalOutstanding = disbursed.reduce((s, l) => s + parseFloat(l.amount), 0)
    const overdueAmount = repayments.filter(r => r.status === RepaymentStatus.OVERDUE).reduce((s, r) => s + parseFloat(r.amount), 0)
    const par = totalOutstanding > 0 ? ((overdueAmount / totalOutstanding) * 100).toFixed(2) : '0.00'

    return {
      total: loans.length,
      pending: loans.filter(l => [LoanStatus.PENDING_BM, LoanStatus.PENDING_HOC].includes(l.status)).length,
      approved: loans.filter(l => l.status === LoanStatus.APPROVED).length,
      disbursed: disbursed.length,
      declined: loans.filter(l => l.status === LoanStatus.DECLINED).length,
      totalDisbursedAmount: totalOutstanding.toFixed(2),
      parRatio: par,
    }
  }
}
