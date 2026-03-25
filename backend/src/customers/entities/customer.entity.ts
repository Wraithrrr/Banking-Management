import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Bank } from '../../banks/entities/bank.entity'

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  bvn: string

  @Column()
  phone: string

  @Column({ nullable: true })
  email: string

  @Column({ type: 'date' })
  dateOfBirth: string

  @Column()
  address: string

  @Column({ type: 'enum', enum: Gender })
  gender: Gender

  @Column()
  bankId: number

  @ManyToOne(() => Bank, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bankId' })
  bank: Bank

  @Column({ default: false })
  isKycApproved: boolean

  @Column({ nullable: true })
  kycApprovedById: number

  @Column({ nullable: true })
  createdById: number

  // KYC document paths (stored as comma-separated or JSON string)
  @Column({ nullable: true, type: 'text' })
  kycDocumentPaths: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
