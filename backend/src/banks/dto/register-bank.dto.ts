import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { BankType } from '../entities/bank.entity'

export class RegisterBankDto {
  @IsNotEmpty()
  @IsString()
  bankName: string

  @IsEnum(BankType)
  bankType: BankType

  @IsNotEmpty()
  @IsString()
  cbnLicenseNumber: string

  @IsNotEmpty()
  @IsString()
  rcNumber: string

  @IsNotEmpty()
  @IsString()
  adminFullName: string

  @IsEmail()
  adminEmail: string

  @IsString()
  adminPhone: string

  @MinLength(8)
  adminPassword: string
}
