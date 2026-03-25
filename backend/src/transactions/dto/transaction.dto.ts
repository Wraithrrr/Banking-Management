import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class DepositDto {
  @IsString()
  accountNumber: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Type(() => Number)
  amount: number

  @IsString()
  @IsOptional()
  narration?: string
}

export class WithdrawalDto {
  @IsString()
  accountNumber: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Type(() => Number)
  amount: number

  @IsString()
  @IsOptional()
  narration?: string
}

export class TransferDto {
  @IsString()
  fromAccountNumber: string

  @IsString()
  toAccountNumber: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Type(() => Number)
  amount: number

  @IsString()
  @IsOptional()
  narration?: string
}
