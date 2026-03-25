import { IsEnum, IsNumber, IsString, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { LoanType } from '../entities/loan-application.entity'

export class CreateLoanDto {
  @IsNumber()
  customerId: number

  @IsString()
  customerName: string

  @IsString()
  accountNumber: string

  @IsEnum(LoanType)
  type: LoanType

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1000)
  @Type(() => Number)
  amount: number

  @IsString()
  purpose: string

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  termMonths: number
}

export class DecisionDto {
  @IsString()
  @IsOptional()
  declineReason?: string
}
