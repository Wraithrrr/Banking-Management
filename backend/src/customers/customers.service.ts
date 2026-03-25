import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Customer } from './entities/customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto, actor: { userId: number; bankId: number; role: string }): Promise<Customer> {
    const existing = await this.customersRepository.findOne({ where: { bvn: dto.bvn, bankId: actor.bankId } })
    if (existing) {
      throw new ConflictException('A customer with this BVN already exists in your bank.')
    }

    const customer = this.customersRepository.create({
      ...dto,
      bankId: actor.bankId,
      createdById: actor.userId,
    })
    return this.customersRepository.save(customer)
  }

  async findAll(actor: { bankId: number }, search?: string): Promise<Customer[]> {
    if (search) {
      return this.customersRepository.find({
        where: [
          { bankId: actor.bankId, firstName: Like(`%${search}%`) },
          { bankId: actor.bankId, lastName: Like(`%${search}%`) },
          { bankId: actor.bankId, bvn: Like(`%${search}%`) },
          { bankId: actor.bankId, phone: Like(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
        take: 100,
      })
    }
    return this.customersRepository.find({
      where: { bankId: actor.bankId },
      order: { createdAt: 'DESC' },
      take: 100,
    })
  }

  async findOne(id: number, actor: { bankId: number }): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id, bankId: actor.bankId } })
    if (!customer) throw new NotFoundException('Customer not found.')
    return customer
  }

  async approveKyc(id: number, actor: { userId: number; bankId: number; role: string }): Promise<Customer> {
    if (actor.role !== 'compliance') {
      throw new ForbiddenException('Only Compliance Officers can approve KYC.')
    }
    const customer = await this.findOne(id, actor)
    await this.customersRepository.update(id, { isKycApproved: true, kycApprovedById: actor.userId })
    return { ...customer, isKycApproved: true }
  }

  async attachDocumentPaths(id: number, paths: string[], actor: { bankId: number }): Promise<void> {
    const customer = await this.findOne(id, actor)
    const existing = customer.kycDocumentPaths ? JSON.parse(customer.kycDocumentPaths) : []
    const merged = [...existing, ...paths]
    await this.customersRepository.update(id, { kycDocumentPaths: JSON.stringify(merged) })
  }
}
