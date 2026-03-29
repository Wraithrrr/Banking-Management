import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoanApplication, LoanStatus } from '../loans/entities/loan-application.entity'
import { LoanRepayment, RepaymentStatus } from '../loans/entities/loan-repayment.entity'
import { Customer, Gender } from '../customers/entities/customer.entity'
import { Account, AccountStatus } from '../accounts/entities/account.entity'
import { Branch } from '../branches/entities/branch.entity'
import { User, UserRole } from '../users/entities/user.entity'

// ── Native date helpers ────────────────────────────────────────────────────────
function diffDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000)
}
function subMonths(d: Date, n: number): Date {
  const r = new Date(d)
  r.setMonth(r.getMonth() - n)
  return r
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
}
function fmtMonth(d: Date): string {
  return d.toLocaleString('en-US', { month: 'short' })
}

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(LoanApplication)
    private loanRepo: Repository<LoanApplication>,
    @InjectRepository(LoanRepayment)
    private repaymentRepo: Repository<LoanRepayment>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getMetrics(bankId: number) {
    const now = new Date()
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    // ── Loans ──────────────────────────────────────────────────────────────────
    const allLoans = await this.loanRepo.find({ where: { bankId } })
    const disbursedLoans = allLoans.filter(l => l.status === LoanStatus.DISBURSED)
    const totalPortfolio = disbursedLoans.reduce((s, l) => s + parseFloat(l.amount), 0)
    const lastMonthDisbursed = disbursedLoans.filter(l => {
      const d = new Date(l.updatedAt)
      return d >= lastMonthStart && d <= lastMonthEnd
    })
    const lastMonthPortfolio = lastMonthDisbursed.reduce((s, l) => s + parseFloat(l.amount), 0)
    const portfolioGrowth = lastMonthPortfolio > 0
      ? +((totalPortfolio - lastMonthPortfolio) / lastMonthPortfolio * 100).toFixed(1)
      : 0

    const activeBorrowers = new Set(disbursedLoans.map(l => l.customerId)).size

    // ── Customers ──────────────────────────────────────────────────────────────
    const allCustomers = await this.customerRepo.find({ where: { bankId } })
    const totalCustomers = allCustomers.length
    const lastMonthCustomers = allCustomers.filter(c => new Date(c.createdAt) <= lastMonthEnd).length
    const customerGrowth = lastMonthCustomers > 0
      ? +((totalCustomers - lastMonthCustomers) / lastMonthCustomers * 100).toFixed(1)
      : 0
    const femaleCount = allCustomers.filter(c => c.gender === Gender.FEMALE).length
    const femalePercentage = totalCustomers > 0 ? +(femaleCount / totalCustomers * 100).toFixed(1) : 0
    const kycApproved = allCustomers.filter(c => c.isKycApproved).length
    const kycPending = totalCustomers - kycApproved

    // ── Repayments for PAR ─────────────────────────────────────────────────────
    const allRepayments = await this.repaymentRepo
      .createQueryBuilder('r')
      .innerJoin('loan_applications', 'l', 'l.id = r."loanId" AND l."bankId" = :bankId', { bankId })
      .getMany()

    const overdueRepayments = allRepayments.filter(r => r.status === RepaymentStatus.OVERDUE)
    const paidRepayments = allRepayments.filter(r => r.status === RepaymentStatus.PAID)

    const overdue30 = overdueRepayments.filter(r => diffDays(now, new Date(r.dueDate)) > 30)
    const overdue90 = overdueRepayments.filter(r => diffDays(now, new Date(r.dueDate)) > 90)
    const overdue1to30 = overdueRepayments.filter(r => { const d = diffDays(now, new Date(r.dueDate)); return d >= 1 && d <= 30 })
    const overdue31to90 = overdueRepayments.filter(r => { const d = diffDays(now, new Date(r.dueDate)); return d >= 31 && d <= 90 })

    const overdue30Amount = overdue30.reduce((s, r) => s + parseFloat(r.amount), 0)
    const overdue90Amount = overdue90.reduce((s, r) => s + parseFloat(r.amount), 0)
    const par1to30Amount = overdue1to30.reduce((s, r) => s + parseFloat(r.amount), 0)
    const par31to90Amount = overdue31to90.reduce((s, r) => s + parseFloat(r.amount), 0)

    const par30 = totalPortfolio > 0 ? +(overdue30Amount / totalPortfolio * 100).toFixed(2) : 0
    const par90 = totalPortfolio > 0 ? +(overdue90Amount / totalPortfolio * 100).toFixed(2) : 0
    const par1to30 = totalPortfolio > 0 ? +(par1to30Amount / totalPortfolio * 100).toFixed(2) : 0
    const par31to90 = totalPortfolio > 0 ? +(par31to90Amount / totalPortfolio * 100).toFixed(2) : 0
    const onTimeRate = allRepayments.length > 0
      ? +(paidRepayments.length / allRepayments.length * 100).toFixed(1)
      : 100

    // ── Staff & Branches ───────────────────────────────────────────────────────
    const allUsers = await this.userRepo.find({ where: { bankId, isActive: true } })
    const activeStaff = allUsers.filter(u => u.role !== UserRole.OWNER).length
    const allBranches = await this.branchRepo.find({ where: { bankId, isActive: true } })
    const activeBranches = allBranches.length

    const roleMap: Record<string, number> = {}
    for (const u of allUsers) {
      if (u.role !== UserRole.OWNER) roleMap[u.role] = (roleMap[u.role] || 0) + 1
    }
    const staffByRole = Object.entries(roleMap).map(([role, count]) => ({ role, count }))

    // ── Accounts / Savings ─────────────────────────────────────────────────────
    const allAccounts = await this.accountRepo.find({ where: { bankId } })
    const activeAccounts = allAccounts.filter(a => a.status === AccountStatus.ACTIVE)
    const totalDeposits = activeAccounts.reduce((s, a) => s + parseFloat(a.balance), 0)
    const activeSavingsAccounts = activeAccounts.length
    const avgBalancePerCustomer = activeSavingsAccounts > 0 ? +(totalDeposits / activeSavingsAccounts).toFixed(2) : 0
    const lastMonthDepositTotal = allAccounts.filter(a => new Date(a.createdAt) <= lastMonthEnd).reduce((s, a) => s + parseFloat(a.balance), 0)
    const depositGrowth = lastMonthDepositTotal > 0
      ? +((totalDeposits - lastMonthDepositTotal) / lastMonthDepositTotal * 100).toFixed(1)
      : 0

    const monthlyDepositTrend = Array.from({ length: 6 }, (_, i) => {
      const m = subMonths(now, 5 - i)
      const start = startOfMonth(m)
      const end = endOfMonth(m)
      const amount = allAccounts
        .filter(a => { const d = new Date(a.createdAt); return d >= start && d <= end })
        .reduce((s, a) => s + parseFloat(a.balance), 0)
      return { month: fmtMonth(m), amount: Math.round(amount) }
    })

    // ── Loan product breakdown ─────────────────────────────────────────────────
    const personalLoans = disbursedLoans.filter(l => l.type === 'personal')
    const businessLoans = disbursedLoans.filter(l => l.type === 'business')

    const makeProduct = (name: string, loans: LoanApplication[]) => ({
      product: name,
      activeLoans: loans.length,
      outstandingAmount: loans.reduce((s, l) => s + parseFloat(l.amount), 0),
      par: 0,
      avgTermMonths: loans.length > 0 ? Math.round(loans.reduce((s, l) => s + l.termMonths, 0) / loans.length) : 0,
      avgLoanSize: loans.length > 0 ? Math.round(loans.reduce((s, l) => s + parseFloat(l.amount), 0) / loans.length) : 0,
    })

    const byProduct = [makeProduct('Individual', personalLoans), makeProduct('MSME', businessLoans)]

    // ── Monthly loan trend (last 6 months) ─────────────────────────────────────
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const m = subMonths(now, 5 - i)
      const start = startOfMonth(m)
      const end = endOfMonth(m)
      const disbursed = disbursedLoans
        .filter(l => { const d = new Date(l.updatedAt); return d >= start && d <= end })
        .reduce((s, l) => s + parseFloat(l.amount), 0)
      const repaid = paidRepayments
        .filter(r => r.paidAt && new Date(r.paidAt) >= start && new Date(r.paidAt) <= end)
        .reduce((s, r) => s + parseFloat(r.paidAmount), 0)
      const newBorrowers = new Set(
        allLoans.filter(l => { const d = new Date(l.createdAt); return d >= start && d <= end }).map(l => l.customerId),
      ).size
      return {
        month: fmtMonth(m),
        disbursed: +(disbursed / 1_000_000).toFixed(1),
        repaid: +(repaid / 1_000_000).toFixed(1),
        newBorrowers,
      }
    })

    // ── Branch performance ─────────────────────────────────────────────────────
    const branches = allBranches.map(b => {
      const bLoans = disbursedLoans.filter(l => l.branchId === b.id)
      const bPortfolio = bLoans.reduce((s, l) => s + parseFloat(l.amount), 0)
      const bBorrowers = new Set(bLoans.map(l => l.customerId)).size
      const bOfficers = allUsers.filter(u => u.branchId === b.id && u.role === UserRole.CREDIT_OFFICER).length
      const bLoanIds = new Set(bLoans.map(l => l.id))
      const bRepaid = paidRepayments.filter(r => bLoanIds.has(r.loanId))
      const bDue = allRepayments.filter(r => bLoanIds.has(r.loanId))
      const collectionRate = bDue.length > 0 ? +(bRepaid.length / bDue.length * 100).toFixed(1) : 100
      const bOverdue30 = overdue30.filter(r => bLoanIds.has(r.loanId)).reduce((s, r) => s + parseFloat(r.amount), 0)
      const bPar30 = bPortfolio > 0 ? +(bOverdue30 / bPortfolio * 100).toFixed(1) : 0
      const efficiencyScore = Math.min(
        100,
        Math.round(collectionRate * 0.6 + (bOfficers > 0 ? Math.min(100, (bBorrowers / bOfficers) * 2) : 0) * 0.4),
      )
      const status: 'excellent' | 'good' | 'needs-attention' | 'critical' =
        efficiencyScore >= 90 ? 'excellent' :
        efficiencyScore >= 75 ? 'good' :
        efficiencyScore >= 50 ? 'needs-attention' : 'critical'

      return {
        id: b.id, name: b.name,
        location: b.address.split(',')[0]?.trim() ?? b.name,
        loanOfficerCount: bOfficers,
        activeBorrowers: bBorrowers,
        portfolioSize: Math.round(bPortfolio),
        par30: parseFloat(bPar30.toString()),
        collectionRate,
        efficiencyScore,
        status,
      }
    })

    // ── Field officers ─────────────────────────────────────────────────────────
    const creditOfficers = allUsers.filter(u => u.role === UserRole.CREDIT_OFFICER)
    const officerSummaries = creditOfficers.slice(0, 10).map(o => {
      const oLoans = disbursedLoans.filter(l => l.creditOfficerId === o.id)
      const oLoanIds = new Set(oLoans.map(l => l.id))
      const oRepaid = paidRepayments.filter(r => oLoanIds.has(r.loanId))
      const oDue = allRepayments.filter(r => oLoanIds.has(r.loanId))
      const rate = oDue.length > 0 ? +(oRepaid.length / oDue.length * 100).toFixed(1) : 100
      const branch = allBranches.find(b => b.id === o.branchId)
      return { id: o.id, name: o.fullName, branchName: branch?.name ?? 'N/A', activeLoans: oLoans.length, collectionRate: rate, par30: 0 }
    })
    const sorted = [...officerSummaries].sort((a, b) => b.collectionRate - a.collectionRate)
    const avgCollectionRate = officerSummaries.length > 0
      ? +(officerSummaries.reduce((s, o) => s + o.collectionRate, 0) / officerSummaries.length).toFixed(1)
      : 100

    // ── Social Impact ──────────────────────────────────────────────────────────
    const estimatedJobsCreated = businessLoans.length * 3
    const repaymentHealth = Math.min(100, Math.round(onTimeRate))
    const outreachGrowth = Math.min(100, Math.round(Math.abs(customerGrowth) * 2))
    const genderInclusion = Math.min(100, Math.round(femalePercentage * 1.5))
    const ruralPenetration = 45
    const sustainabilityScore = Math.round(
      repaymentHealth * 0.35 + outreachGrowth * 0.25 + genderInclusion * 0.25 + ruralPenetration * 0.15,
    )

    const ossRatio = Math.round(onTimeRate * 1.2)

    return {
      kpis: {
        totalLoanPortfolio: Math.round(totalPortfolio),
        portfolioGrowth,
        activeBorrowers,
        borrowerGrowth: customerGrowth,
        par30,
        par30Trend: 0,
        par90,
        ossRatio,
        ossTarget: 100,
        totalCustomers,
        customerGrowth,
        activeStaff,
        activeBranches,
      },
      loanPortfolio: {
        totalDisbursed: Math.round(totalPortfolio),
        outstandingBalance: Math.round(totalPortfolio),
        totalCollected: Math.round(paidRepayments.reduce((s, r) => s + parseFloat(r.paidAmount), 0)),
        writeOffs: 0,
        byProduct,
        monthlyTrend,
      },
      repaymentHealth: {
        onTimeRate,
        par1to30,
        par1to30Amount: Math.round(par1to30Amount),
        par31to90,
        par31to90Amount: Math.round(par31to90Amount),
        par90plus: par90,
        par90plusAmount: Math.round(overdue90Amount),
        writeOffRate: 0,
      },
      branches,
      fieldOfficers: {
        avgLoansPerOfficer: creditOfficers.length > 0 ? +(disbursedLoans.length / creditOfficers.length).toFixed(1) : 0,
        avgCollectionRate,
        avgDelinquencyRate: par30,
        topOfficers: sorted.slice(0, 3),
        bottomOfficers: sorted.slice(-2).reverse(),
      },
      savings: {
        totalDeposits: Math.round(totalDeposits),
        depositGrowth,
        avgBalancePerCustomer: Math.round(avgBalancePerCustomer),
        activeSavingsAccounts,
        monthlyDepositTrend,
        segments: [
          { type: 'Individual', count: personalLoans.length, percentage: disbursedLoans.length > 0 ? +(personalLoans.length / disbursedLoans.length * 100).toFixed(1) : 0, avgLoanSize: byProduct[0].avgLoanSize, newThisMonth: 0 },
          { type: 'MSME', count: businessLoans.length, percentage: disbursedLoans.length > 0 ? +(businessLoans.length / disbursedLoans.length * 100).toFixed(1) : 0, avgLoanSize: byProduct[1].avgLoanSize, newThisMonth: 0 },
        ],
        kycStatus: { approved: kycApproved, pending: kycPending },
      },
      socialImpact: {
        totalBeneficiaries: activeBorrowers,
        femalePercentage,
        ruralPercentage: ruralPenetration,
        estimatedJobsCreated,
        csrSpending: 0,
        sustainabilityScore,
        sustainabilityBreakdown: { repaymentHealth, outreachGrowth, genderInclusion, ruralPenetration },
      },
      operationalEfficiency: {
        totalOpex: 0,
        costPerBorrower: 0,
        costPerOfficer: 0,
        opexRatio: 0,
        opexTarget: 20,
        staffByRole,
      },
      alerts: this._buildAlerts(par30, par90, branches, kycPending),
      generatedAt: now.toISOString(),
    }
  }

  private _buildAlerts(par30: number, par90: number, branches: any[], kycPending: number) {
    const alerts: any[] = []
    if (par30 > 5) alerts.push({ id: 'par30-high', type: 'warning', title: 'PAR30 Above Threshold', detail: `Portfolio at Risk >30 days is ${par30}% (target: <5%)`, value: par30 })
    if (par90 > 3) alerts.push({ id: 'par90-high', type: 'critical', title: 'PAR90 Critical', detail: `${par90}% of portfolio is >90 days overdue`, value: par90 })
    if (kycPending > 0) alerts.push({ id: 'kyc-pending', type: 'info', title: 'KYC Approvals Pending', detail: `${kycPending} customer(s) awaiting KYC approval` })
    const critBranch = branches.find(b => b.status === 'critical')
    if (critBranch) alerts.push({ id: `branch-${critBranch.id}`, type: 'critical', title: 'Branch Needs Attention', detail: `${critBranch.name} efficiency score is ${critBranch.efficiencyScore}%`, branchName: critBranch.name })
    return alerts
  }
}
