import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  action: string

  @Column()
  entityType: string

  @Column()
  entityId: number

  @Column()
  actorId: number

  @Column()
  actorRole: string

  @Column()
  actorName: string

  @Column()
  description: string

  @Column({ type: 'text', nullable: true })
  metadata: string | null

  @Column()
  bankId: number

  @Column({ nullable: true })
  branchId: number | null

  @CreateDateColumn()
  createdAt: Date
}
