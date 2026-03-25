import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { AccountType } from '../entities/account.entity'

export class CreateAccountDto {
  @IsNumber()
  customerId: number

  @IsEnum(AccountType)
  type: AccountType

  @IsNumber()
  @IsOptional()
  branchId?: number
}
