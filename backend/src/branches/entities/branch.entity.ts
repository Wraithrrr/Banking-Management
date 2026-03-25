import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Bank } from '../../banks/entities/bank.entity'

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  code: string // e.g. LAG-VI-001

  @Column()
  address: string

  @Column({ nullable: true })
  phone: string

  @Column()
  bankId: number

  @ManyToOne(() => Bank, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bankId' })
  bank: Bank

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
