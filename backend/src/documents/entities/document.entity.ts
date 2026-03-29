import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum DocumentCategory {
  HR = 'hr',
  LOAN = 'loan',
  KYC = 'kyc',
  COMPLIANCE = 'compliance',
  OPERATIONAL = 'operational',
  BRANCH = 'branch',
  GENERAL = 'general',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column({ type: 'enum', enum: DocumentCategory, default: DocumentCategory.GENERAL })
  category: DocumentCategory

  @Column()
  originalName: string

  @Column()
  filePath: string

  @Column({ nullable: true })
  fileSize: number

  @Column({ nullable: true })
  mimeType: string

  // Link to a specific entity (loan, customer, employee, branch)
  @Column({ nullable: true })
  entityType: string

  @Column({ nullable: true })
  entityId: number

  @Column()
  uploadedById: number

  @Column({ nullable: true })
  uploadedByName: string

  @Column()
  bankId: number

  @Column({ nullable: true })
  branchId: number

  @CreateDateColumn()
  createdAt: Date
}
