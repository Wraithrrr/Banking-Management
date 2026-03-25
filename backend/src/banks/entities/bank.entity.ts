import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

export enum BankType {
  COMMERCIAL = 'commercial',
  MICROFINANCE = 'microfinance',
  ISLAMIC = 'islamic',
}

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'enum', enum: BankType })
  type: BankType

  @Column({ unique: true })
  cbnLicenseNumber: string

  @Column({ unique: true })
  rcNumber: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
