import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoanApplication, LoanStatus } from './entities/loan-application.entity'
import { LoanRepayment, RepaymentStatus } from './entities/loan-repayment.entity'
import { CreateLoanDto, DecisionDto } from './dto/loan.dto'

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(LoanApplication)
    private loansRepository: Repository<LoanApplication>,
    @InjectRepository(LoanRepayment)
    private repaymentsRepository: Repository<LoanRepayment>,
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
    return this.loansRepository.save(loan)
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

  async bmDecision(id: number, approve: boolean, dto: DecisionDto, actor: { userId: number; bankId: number; role: string }): Promise<LoanApplication> {
    if (actor.role !== 'branch-manager') throw new ForbiddenException('Only Branch Manager can make this decision.')
    const loan = await this.findOne(id, actor)
    if (loan.status !== LoanStatus.PENDING_BM) throw new ForbiddenException('Loan is not pending Branch Manager review.')

    const update: Partial<LoanApplication> = {
      branchManagerId: actor.userId,
      status: approve ? LoanStatus.PENDING_HOC : LoanStatus.DECLINED,
      declineReason: approve ? null : (dto.declineReason ?? 'Declined by Branch Manager'),
    }
    await this.loansRepository.update(id, update)
    return { ...loan, ...update }
  }

  async hocDecision(id: number, approve: boolean, dto: DecisionDto, actor: { userId: number; bankId: number; role: string }): Promise<LoanApplication> {
    if (actor.role !== 'head-credit') throw new ForbiddenException('Only Head of Credit can make this decision.')
    const loan = await this.findOne(id, actor)
    if (loan.status !== LoanStatus.PENDING_HOC) throw new ForbiddenException('Loan is not pending Head of Credit review.')

    const update: Partial<LoanApplication> = {
      headCreditId: actor.userId,
      status: approve ? LoanStatus.APPROVED : LoanStatus.DECLINED,
      declineReason: approve ? null : (dto.declineReason ?? 'Declined by Head of Credit'),
    }
    await this.loansRepository.update(id, update)
    return { ...loan, ...update }
  }

  async disburse(id: number, actor: { userId: number; bankId: number; role: string }): Promise<LoanApplication> {
    if (actor.role !== 'head-operations') throw new ForbiddenException('Only Head of Operations can disburse.')
    const loan = await this.findOne(id, actor)
    if (loan.status !== LoanStatus.APPROVED) throw new ForbiddenException('Loan must be approved before disbursement.')
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
    return { ...loan, status: LoanStatus.DISBURSED }
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
