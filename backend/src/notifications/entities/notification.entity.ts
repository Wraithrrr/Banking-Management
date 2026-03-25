import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum NotificationType {
  LOAN_UPDATE = 'loan-update',
  TRANSACTION_APPROVAL = 'transaction-approval',
  KYC_UPDATE = 'kyc-update',
  COMPLAINT_ESCALATION = 'complaint-escalation',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  bankId: number

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType

  @Column({ type: 'text' })
  message: string

  @Column({ default: false })
  isRead: boolean

  @Column({ nullable: true })
  relatedEntityId: number

  @Column({ nullable: true })
  relatedEntityType: string

  @CreateDateColumn()
  createdAt: Date
}
