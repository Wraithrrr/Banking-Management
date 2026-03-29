import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('employee_salaries')
export class EmployeeSalary {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: false })
  userId: number

  @Column()
  bankId: number

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  basicSalary: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  housingAllowance: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  transportAllowance: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  otherAllowances: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  pension: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  incomeTax: string

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0.00' })
  otherDeductions: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
