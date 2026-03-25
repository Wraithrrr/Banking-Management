import { Injectable, ConflictException, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from '../users/entities/user.entity'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto'

// Roles that IT Admin cannot assign (protects super-sensitive roles from casual creation)
const PROTECTED_ROLES: UserRole[] = [UserRole.OWNER]

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private generateOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000))
  }

  private requireAdmin(adminUser: { role: string }) {
    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only IT Administrators can perform this action.')
    }
  }

  async createEmployee(dto: CreateEmployeeDto, adminUser: { userId: number; bankId: number; role: string }) {
    this.requireAdmin(adminUser)

    if (PROTECTED_ROLES.includes(dto.role)) {
      throw new ForbiddenException(`The "${dto.role}" role can only be assigned during bank registration.`)
    }

    const existing = await this.usersRepository.findOne({ where: { email: dto.email } })
    if (existing) {
      throw new ConflictException('An account with this email already exists.')
    }

    const otp = this.generateOtp()
    const otpExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const employee = this.usersRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      role: dto.role,
      bankId: adminUser.bankId,
      otpCode: otp,
      otpExpiresAt,
      isFirstLogin: true,
      isActive: true,
    })
    await this.usersRepository.save(employee)

    return {
      message: 'Employee account created successfully.',
      otp,
      employee: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
      },
    }
  }

  async getEmployees(adminUser: { userId: number; bankId: number; role: string }) {
    this.requireAdmin(adminUser)

    const employees = await this.usersRepository.find({
      where: { bankId: adminUser.bankId },
      order: { createdAt: 'DESC' },
    })

    return employees.map(emp => ({
      id: emp.id,
      fullName: emp.fullName,
      email: emp.email,
      role: emp.role,
      branchId: emp.branchId,
      isFirstLogin: emp.isFirstLogin,
      isActive: emp.isActive,
      createdAt: emp.createdAt,
    }))
  }

  async deactivateEmployee(employeeId: number, adminUser: { userId: number; bankId: number; role: string }) {
    this.requireAdmin(adminUser)

    const employee = await this.usersRepository.findOne({ where: { id: employeeId, bankId: adminUser.bankId } })
    if (!employee) {
      throw new NotFoundException('Employee not found.')
    }
    if (employee.role === UserRole.ADMIN) {
      throw new ForbiddenException('Cannot deactivate another admin account.')
    }

    await this.usersRepository.update(employee.id, { isActive: false })
    return { message: `${employee.fullName}'s account has been deactivated.` }
  }

  async activateEmployee(employeeId: number, adminUser: { userId: number; bankId: number; role: string }) {
    this.requireAdmin(adminUser)

    const employee = await this.usersRepository.findOne({ where: { id: employeeId, bankId: adminUser.bankId } })
    if (!employee) {
      throw new NotFoundException('Employee not found.')
    }

    await this.usersRepository.update(employee.id, { isActive: true })
    return { message: `${employee.fullName}'s account has been reactivated.` }
  }

  async resetOtp(employeeId: number, adminUser: { userId: number; bankId: number; role: string }) {
    this.requireAdmin(adminUser)

    const employee = await this.usersRepository.findOne({ where: { id: employeeId, bankId: adminUser.bankId } })
    if (!employee) {
      throw new NotFoundException('Employee not found.')
    }

    const otp = this.generateOtp()
    const otpExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await this.usersRepository.update(employee.id, {
      otpCode: otp,
      otpExpiresAt,
      isFirstLogin: true,
      password: null,
    })

    return {
      message: `OTP has been reset for ${employee.fullName}. Share the new OTP with them securely.`,
      otp,
    }
  }

  async updateEmployeeRole(employeeId: number, dto: UpdateEmployeeRoleDto, adminUser: { userId: number; bankId: number; role: string }) {
    this.requireAdmin(adminUser)

    const employee = await this.usersRepository.findOne({ where: { id: employeeId, bankId: adminUser.bankId } })
    if (!employee) {
      throw new NotFoundException('Employee not found.')
    }
    if (PROTECTED_ROLES.includes(dto.role)) {
      throw new ForbiddenException(`Cannot assign the "${dto.role}" role.`)
    }
    if (employee.role === UserRole.ADMIN) {
      throw new ForbiddenException('Cannot change the role of an admin account.')
    }

    await this.usersRepository.update(employee.id, { role: dto.role })
    return { message: `${employee.fullName}'s role has been updated to "${dto.role}".` }
  }
}
