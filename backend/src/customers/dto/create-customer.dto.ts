import { IsString, IsEmail, IsOptional, IsEnum, Length, Matches } from 'class-validator'
import { Gender } from '../entities/customer.entity'

export class CreateCustomerDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  @Length(11, 11, { message: 'BVN must be exactly 11 digits' })
  @Matches(/^\d+$/, { message: 'BVN must contain only digits' })
  bvn: string

  @IsString()
  phone: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  dateOfBirth: string

  @IsString()
  address: string

  @IsEnum(Gender)
  gender: Gender
}
