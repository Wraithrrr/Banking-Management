import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Bank } from '../../banks/entities/bank.entity'

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  COMPLIANCE = 'compliance',
  INTERNAL_CONTROL = 'internal-control',
  HEAD_OPERATIONS = 'head-operations',
  HEAD_CREDIT = 'head-credit',
  BRANCH_MANAGER = 'branch-manager',
  CREDIT_OFFICER = 'credit-officer',
  CUSTOMER_SERVICE = 'customer-service',
  ACCOUNT_OFFICER = 'account-officer',
  TELLER = 'teller',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  fullName: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  password: string

  @Column({ nullable: true })
  phone: string

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole

  @Column({ nullable: true })
  bankId: number

  @ManyToOne(() => Bank, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bankId' })
  bank: Bank

  @Column({ nullable: true })
  branchId: number

  @Column({ nullable: true, length: 6 })
  otpCode: string

  @Column({ nullable: true, type: 'timestamptz' })
  otpExpiresAt: Date

  @Column({ default: true })
  isFirstLogin: boolean

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
