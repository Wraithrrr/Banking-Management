import { IsEnum } from 'class-validator'
import { UserRole } from '../../users/entities/user.entity'

export class UpdateEmployeeRoleDto {
  @IsEnum(UserRole)
  role: UserRole
}
