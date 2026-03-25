import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum LoanType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
}

export enum LoanStatus {
  DRAFT = 'draft',
  PENDING_BM = 'pending-bm',
  PENDING_HOC = 'pending-hoc',
  APPROVED = 'approved',
  DECLINED = 'declined',
  DISBURSED = 'disbursed',
}

@Entity('loan_applications')
export class LoanApplication {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  customerId: number

  @Column()
  customerName: string

  @Column()
  accountNumber: string

  @Column({ type: 'enum', enum: LoanType })
  type: LoanType

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string

  @Column()
  purpose: string

  @Column()
  termMonths: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: '15.00' })
  interestRate: string

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.PENDING_BM })
  status: LoanStatus

  @Column()
  creditOfficerId: number

  @Column({ nullable: true })
  branchManagerId: number

  @Column({ nullable: true })
  headCreditId: number

  @Column({ nullable: true })
  branchId: number

  @Column()
  bankId: number

  @Column({ nullable: true, type: 'text' })
  declineReason: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
