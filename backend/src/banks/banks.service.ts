import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Bank } from './entities/bank.entity'
import { User, UserRole } from '../users/entities/user.entity'
import { RegisterBankDto } from './dto/register-bank.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterBankDto) {
    const existingBank = await this.banksRepository.findOne({
      where: [{ cbnLicenseNumber: dto.cbnLicenseNumber }, { rcNumber: dto.rcNumber }],
    })
    if (existingBank) {
      throw new ConflictException('A bank with this CBN License or RC Number already exists.')
    }

    const existingAdmin = await this.usersRepository.findOne({ where: { email: dto.adminEmail } })
    if (existingAdmin) {
      throw new ConflictException('An account with this email already exists.')
    }

    const bank = this.banksRepository.create({
      name: dto.bankName,
      type: dto.bankType,
      cbnLicenseNumber: dto.cbnLicenseNumber,
      rcNumber: dto.rcNumber,
    })
    const savedBank = await this.banksRepository.save(bank)

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10)
    const admin = this.usersRepository.create({
      fullName: dto.adminFullName,
      email: dto.adminEmail,
      phone: dto.adminPhone,
      password: hashedPassword,
      role: UserRole.ADMIN,
      bankId: savedBank.id,
      isFirstLogin: false,
      isActive: true,
    })
    await this.usersRepository.save(admin)

    return { message: 'Bank registered successfully', bankId: savedBank.id }
  }
}
