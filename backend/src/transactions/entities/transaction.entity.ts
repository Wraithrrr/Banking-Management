import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Account } from '../../accounts/entities/account.entity'

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING_APPROVAL = 'pending-approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  reference: string

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string

  @Column({ nullable: true })
  narration: string

  @Column({ nullable: true })
  fromAccountId: number

  @ManyToOne(() => Account, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'fromAccountId' })
  fromAccount: Account

  @Column({ nullable: true })
  toAccountId: number

  @ManyToOne(() => Account, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'toAccountId' })
  toAccount: Account

  @Column()
  tellerUserId: number

  @Column()
  branchId: number

  @Column()
  bankId: number

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.COMPLETED })
  status: TransactionStatus

  @Column({ default: false })
  requiresApproval: boolean

  @Column({ nullable: true })
  approvedById: number

  @CreateDateColumn()
  createdAt: Date
}
