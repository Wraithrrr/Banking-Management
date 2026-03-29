import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EmployeeSalary } from './entities/employee-salary.entity'
import { PayrollRun, PayrollStatus } from './entities/payroll-run.entity'
import { User } from '../users/entities/user.entity'

export interface PayrollEntry {
  userId: number
  fullName: string
  role: string
  basicSalary: number
  totalAllowances: number
  totalDeductions: number
  grossPay: number
  netPay: number
}

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(EmployeeSalary)
    private salaryRepo: Repository<EmployeeSalary>,
    @InjectRepository(PayrollRun)
    private runRepo: Repository<PayrollRun>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  // ── Salary Setup ──────────────────────────────────────────────────────────

  async setSalary(
    userId: number,
    dto: { basicSalary: number; housingAllowance?: number; transportAllowance?: number; otherAllowances?: number; pension?: number; incomeTax?: number; otherDeductions?: number },
    actor: { bankId: number; role: string },
  ): Promise<EmployeeSalary> {
    if (actor.role !== 'admin') throw new ForbiddenException('Only Admin can set employee salaries.')

    let salary = await this.salaryRepo.findOne({ where: { userId, bankId: actor.bankId } })
    const data = {
      userId,
      bankId: actor.bankId,
      basicSalary: (dto.basicSalary ?? 0).toFixed(2),
      housingAllowance: (dto.housingAllowance ?? 0).toFixed(2),
      transportAllowance: (dto.transportAllowance ?? 0).toFixed(2),
      otherAllowances: (dto.otherAllowances ?? 0).toFixed(2),
      pension: (dto.pension ?? 0).toFixed(2),
      incomeTax: (dto.incomeTax ?? 0).toFixed(2),
      otherDeductions: (dto.otherDeductions ?? 0).toFixed(2),
    }

    if (salary) {
      await this.salaryRepo.update(salary.id, data)
      return { ...salary, ...data }
    }
    salary = this.salaryRepo.create(data)
    return this.salaryRepo.save(salary)
  }

  async getSalaries(actor: { bankId: number; role: string }): Promise<(EmployeeSalary & { user?: Partial<User> })[]> {
    if (!['admin', 'owner', 'head-operations'].includes(actor.role)) throw new ForbiddenException('Access denied.')
    const salaries = await this.salaryRepo.find({ where: { bankId: actor.bankId } })
    const users = await this.usersRepo.find({ where: { bankId: actor.bankId }, select: ['id', 'fullName', 'role', 'branchId'] })
    const userMap = new Map(users.map(u => [u.id, u]))
    return salaries.map(s => ({ ...s, user: userMap.get(s.userId) }))
  }

  async getSalaryForUser(userId: number, bankId: number): Promise<EmployeeSalary | null> {
    return this.salaryRepo.findOne({ where: { userId, bankId } })
  }

  // ── Payroll Run ───────────────────────────────────────────────────────────

  async runPayroll(
    period: string, // YYYY-MM
    actor: { userId: number; bankId: number; role: string },
  ): Promise<PayrollRun> {
    if (actor.role !== 'admin') throw new ForbiddenException('Only Admin can generate payroll.')

    const existing = await this.runRepo.findOne({ where: { bankId: actor.bankId, period } })
    if (existing && existing.status !== PayrollStatus.DRAFT) {
      throw new ConflictException(`Payroll for ${period} has already been approved or paid.`)
    }

    // Get all active employees and their salaries
    const employees = await this.usersRepo.find({
      where: { bankId: actor.bankId, isActive: true },
      select: ['id', 'fullName', 'role'],
    })
    const salaries = await this.salaryRepo.find({ where: { bankId: actor.bankId } })
    const salaryMap = new Map(salaries.map(s => [s.userId, s]))

    let totalGross = 0
    let totalDeductions = 0
    let totalNet = 0

    const entries: PayrollEntry[] = employees.map(emp => {
      const s = salaryMap.get(emp.id)
      const basic = parseFloat(s?.basicSalary ?? '0')
      const allowances = parseFloat(s?.housingAllowance ?? '0') + parseFloat(s?.transportAllowance ?? '0') + parseFloat(s?.otherAllowances ?? '0')
      const deductions = parseFloat(s?.pension ?? '0') + parseFloat(s?.incomeTax ?? '0') + parseFloat(s?.otherDeductions ?? '0')
      const gross = basic + allowances
      const net = gross - deductions

      totalGross += gross
      totalDeductions += deductions
      totalNet += net

      return {
        userId: emp.id,
        fullName: emp.fullName,
        role: emp.role,
        basicSalary: basic,
        totalAllowances: allowances,
        totalDeductions: deductions,
        grossPay: gross,
        netPay: net,
      }
    })

    if (existing) {
      await this.runRepo.update(existing.id, {
        totalGross: totalGross.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        totalNet: totalNet.toFixed(2),
        employeeCount: entries.length,
        entries: JSON.stringify(entries),
        status: PayrollStatus.DRAFT,
      })
      return this.runRepo.findOne({ where: { id: existing.id } })
    }

    const run = this.runRepo.create({
      bankId: actor.bankId,
      period,
      status: PayrollStatus.DRAFT,
      totalGross: totalGross.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      totalNet: totalNet.toFixed(2),
      employeeCount: entries.length,
      entries: JSON.stringify(entries),
      createdById: actor.userId,
    })
    return this.runRepo.save(run)
  }

  async getPayrollRuns(actor: { bankId: number; role: string }): Promise<PayrollRun[]> {
    if (!['admin', 'owner', 'head-operations'].includes(actor.role)) throw new ForbiddenException('Access denied.')
    return this.runRepo.find({
      where: { bankId: actor.bankId },
      order: { createdAt: 'DESC' },
      take: 24,
    })
  }

  async getPayrollRun(id: number, actor: { bankId: number; role: string }): Promise<PayrollRun> {
    if (!['admin', 'owner', 'head-operations'].includes(actor.role)) throw new ForbiddenException('Access denied.')
    const run = await this.runRepo.findOne({ where: { id, bankId: actor.bankId } })
    if (!run) throw new NotFoundException('Payroll run not found.')
    return run
  }

  async approvePayroll(id: number, actor: { userId: number; bankId: number; role: string }): Promise<PayrollRun> {
    if (actor.role !== 'head-operations') throw new ForbiddenException('Only Head of Operations can approve payroll.')
    const run = await this.runRepo.findOne({ where: { id, bankId: actor.bankId } })
    if (!run) throw new NotFoundException('Payroll run not found.')
    if (run.status !== PayrollStatus.DRAFT) throw new ForbiddenException('Payroll has already been approved or paid.')
    await this.runRepo.update(id, { status: PayrollStatus.APPROVED, approvedById: actor.userId, approvedAt: new Date() })
    return { ...run, status: PayrollStatus.APPROVED }
  }

  async markPaid(id: number, actor: { userId: number; bankId: number; role: string }): Promise<PayrollRun> {
    if (!['admin', 'head-operations'].includes(actor.role)) throw new ForbiddenException('Only Admin or Head of Operations can mark payroll as paid.')
    const run = await this.runRepo.findOne({ where: { id, bankId: actor.bankId } })
    if (!run) throw new NotFoundException('Payroll run not found.')
    if (run.status !== PayrollStatus.APPROVED) throw new ForbiddenException('Payroll must be approved before marking as paid.')
    await this.runRepo.update(id, { status: PayrollStatus.PAID, paidAt: new Date() })
    return { ...run, status: PayrollStatus.PAID }
  }
}
