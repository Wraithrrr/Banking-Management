import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Account, AccountStatus } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  // Generate a unique 10-digit account number
  private async generateAccountNumber(): Promise<string> {
    for (let attempt = 0; attempt < 20; attempt++) {
      const num = String(Math.floor(1000000000 + Math.random() * 9000000000))
      const exists = await this.accountsRepository.findOne({ where: { accountNumber: num } })
      if (!exists) return num
    }
    throw new ConflictException('Could not generate a unique account number. Please try again.')
  }

  async create(dto: CreateAccountDto, actor: { userId: number; bankId: number; branchId?: number }): Promise<Account> {
    const accountNumber = await this.generateAccountNumber()
    const account = this.accountsRepository.create({
      accountNumber,
      type: dto.type,
      customerId: dto.customerId,
      branchId: dto.branchId ?? actor.branchId ?? null,
      bankId: actor.bankId,
      status: AccountStatus.ACTIVE,
      createdById: actor.userId,
    })
    return this.accountsRepository.save(account)
  }

  async findByAccountNumber(accountNumber: string, actor: { bankId: number }): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { accountNumber, bankId: actor.bankId },
      relations: ['customer'],
    })
    if (!account) throw new NotFoundException('Account not found.')
    return account
  }

  async findById(id: number, actor: { bankId: number }): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id, bankId: actor.bankId },
      relations: ['customer'],
    })
    if (!account) throw new NotFoundException('Account not found.')
    return account
  }

  async findByCustomer(customerId: number, actor: { bankId: number }): Promise<Account[]> {
    return this.accountsRepository.find({
      where: { customerId, bankId: actor.bankId },
      order: { createdAt: 'DESC' },
    })
  }

  async findAll(actor: { bankId: number; branchId?: number }): Promise<Account[]> {
    const where: any = { bankId: actor.bankId }
    if (actor.branchId) where.branchId = actor.branchId
    return this.accountsRepository.find({
      where,
      relations: ['customer'],
      order: { createdAt: 'DESC' },
      take: 200,
    })
  }

  // Used internally by transactions module to update balance
  async updateBalance(accountId: number, newBalance: number): Promise<void> {
    await this.accountsRepository.update(accountId, { balance: newBalance.toFixed(2) })
  }
}
