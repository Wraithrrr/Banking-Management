import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { LoanApplication } from './loan-application.entity'

export enum RepaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity('loan_repayments')
export class LoanRepayment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  loanId: number

  @ManyToOne(() => LoanApplication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loanId' })
  loan: LoanApplication

  @Column({ type: 'date' })
  dueDate: string

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  paidAmount: string

  @Column({ type: 'enum', enum: RepaymentStatus, default: RepaymentStatus.PENDING })
  status: RepaymentStatus

  @Column({ nullable: true })
  paidAt: Date

  @CreateDateColumn()
  createdAt: Date
}
