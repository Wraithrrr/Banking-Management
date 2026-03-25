import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Customer } from '../../customers/entities/customer.entity'
import { Bank } from '../../banks/entities/bank.entity'

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
}

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, length: 10 })
  accountNumber: string

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  balance: string

  @Column()
  customerId: number

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer

  @Column({ nullable: true })
  branchId: number

  @Column()
  bankId: number

  @ManyToOne(() => Bank, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bankId' })
  bank: Bank

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus

  @Column({ nullable: true })
  createdById: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
