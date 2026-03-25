import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Branch } from './entities/branch.entity'
import { User, UserRole } from '../users/entities/user.entity'
import { CreateBranchDto } from './dto/create-branch.dto'
import { AssignStaffDto } from './dto/assign-staff.dto'

// Roles that are scoped to a specific branch
const BRANCH_SCOPED_ROLES: UserRole[] = [
  UserRole.BRANCH_MANAGER,
  UserRole.CREDIT_OFFICER,
  UserRole.CUSTOMER_SERVICE,
  UserRole.ACCOUNT_OFFICER,
  UserRole.TELLER,
]

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createBranch(dto: CreateBranchDto, admin: { userId: number; bankId: number; role: string }) {
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only IT Administrators can create branches.')
    }

    const existing = await this.branchesRepository.findOne({ where: { code: dto.code, bankId: admin.bankId } })
    if (existing) {
      throw new ConflictException(`A branch with code "${dto.code}" already exists.`)
    }

    const branch = this.branchesRepository.create({ ...dto, bankId: admin.bankId })
    await this.branchesRepository.save(branch)
    return branch
  }

  async getBranches(admin: { userId: number; bankId: number; role: string }) {
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only IT Administrators can list branches.')
    }
    return this.branchesRepository.find({
      where: { bankId: admin.bankId },
      order: { createdAt: 'DESC' },
    })
  }

  async assignStaff(branchId: number, dto: AssignStaffDto, admin: { userId: number; bankId: number; role: string }) {
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only IT Administrators can assign staff to branches.')
    }

    const branch = await this.branchesRepository.findOne({ where: { id: branchId, bankId: admin.bankId } })
    if (!branch) {
      throw new NotFoundException('Branch not found.')
    }

    const user = await this.usersRepository.findOne({ where: { id: dto.userId, bankId: admin.bankId } })
    if (!user) {
      throw new NotFoundException('Employee not found.')
    }

    if (!BRANCH_SCOPED_ROLES.includes(user.role)) {
      throw new ForbiddenException(`Role "${user.role}" does not require branch assignment.`)
    }

    await this.usersRepository.update(user.id, { branchId })
    return { message: `${user.fullName} has been assigned to branch "${branch.name}".` }
  }

  async getBranchStaff(branchId: number, admin: { userId: number; bankId: number; role: string }) {
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only IT Administrators can view branch staff.')
    }

    const branch = await this.branchesRepository.findOne({ where: { id: branchId, bankId: admin.bankId } })
    if (!branch) {
      throw new NotFoundException('Branch not found.')
    }

    const staff = await this.usersRepository.find({ where: { branchId, bankId: admin.bankId } })
    return staff.map(u => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
    }))
  }
}
