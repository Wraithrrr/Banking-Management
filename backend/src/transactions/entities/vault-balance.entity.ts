import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('vault_balances')
export class VaultBalance {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  branchId: number

  @Column()
  bankId: number

  @Column({ type: 'date' })
  date: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  openingBalance: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  totalDeposits: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  totalWithdrawals: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  closingBalance: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
