import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum ComplaintPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ComplaintStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
}

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  ticketNumber: string

  @Column()
  customerName: string

  @Column({ nullable: true })
  accountNumber: string

  @Column()
  issueType: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'enum', enum: ComplaintPriority, default: ComplaintPriority.MEDIUM })
  priority: ComplaintPriority

  @Column({ type: 'enum', enum: ComplaintStatus, default: ComplaintStatus.OPEN })
  status: ComplaintStatus

  @Column()
  createdById: number

  @Column({ nullable: true })
  assignedToId: number

  @Column({ nullable: true })
  branchId: number

  @Column()
  bankId: number

  @Column({ type: 'timestamptz' })
  slaDeadline: Date

  @Column({ nullable: true })
  resolvedAt: Date

  @Column({ nullable: true, type: 'text' })
  resolutionNote: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
