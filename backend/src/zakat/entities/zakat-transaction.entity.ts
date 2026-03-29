import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum ZakatType {
  COLLECTED = 'collected',
  DISTRIBUTED = 'distributed',
}

export enum ZakatCategory {
  EDUCATION = 'education',
  HEALTHCARE = 'healthcare',
  POVERTY_RELIEF = 'poverty_relief',
  COMMUNITY_DEV = 'community_dev',
  OTHER = 'other',
}

@Entity('zakat_transactions')
export class ZakatTransaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: ZakatType })
  type: ZakatType

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string

  @Column({ type: 'enum', enum: ZakatCategory })
  category: ZakatCategory

  @Column({ type: 'text' })
  description: string

  @Column({ nullable: true })
  referenceId: string

  @Column()
  recordedById: number

  @Column()
  bankId: number

  @CreateDateColumn()
  createdAt: Date
}
