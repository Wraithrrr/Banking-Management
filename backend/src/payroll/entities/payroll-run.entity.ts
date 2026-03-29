import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum PayrollStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PAID = 'paid',
}

@Entity('payroll_runs')
export class PayrollRun {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  bankId: number

  @Column()
  period: string // YYYY-MM e.g. "2026-03"

  @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.DRAFT })
  status: PayrollStatus

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  totalGross: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  totalDeductions: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  totalNet: string

  @Column({ type: 'int' })
  employeeCount: number

  // Entries stored as JSON array for simplicity
  @Column({ type: 'text' })
  entries: string // JSON: PayrollEntry[]

  @Column({ nullable: true })
  createdById: number

  @Column({ nullable: true })
  approvedById: number

  @Column({ nullable: true, type: 'timestamptz' })
  approvedAt: Date

  @Column({ nullable: true, type: 'timestamptz' })
  paidAt: Date

  @CreateDateColumn()
  createdAt: Date
}
