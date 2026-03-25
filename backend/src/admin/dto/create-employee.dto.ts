import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { UserRole } from '../../users/entities/user.entity'

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  fullName: string

  @IsEmail()
  email: string

  @IsEnum(UserRole)
  role: UserRole
}
