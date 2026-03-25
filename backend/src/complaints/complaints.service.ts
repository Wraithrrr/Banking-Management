import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Complaint, ComplaintPriority, ComplaintStatus } from './entities/complaint.entity'

export class CreateComplaintDto {
  customerName: string
  accountNumber?: string
  issueType: string
  description: string
  priority: ComplaintPriority
}

const SLA_HOURS: Record<ComplaintPriority, number> = {
  [ComplaintPriority.HIGH]: 24,
  [ComplaintPriority.MEDIUM]: 48,
  [ComplaintPriority.LOW]: 72,
}

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
  ) {}

  private generateTicketNumber(): string {
    const ts = Date.now().toString(36).toUpperCase()
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `TKT-${ts}-${rand}`
  }

  async create(dto: CreateComplaintDto, actor: { userId: number; bankId: number; branchId?: number }): Promise<Complaint> {
    const hours = SLA_HOURS[dto.priority] ?? 48
    const slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000)

    const complaint = this.complaintsRepository.create({
      ...dto,
      ticketNumber: this.generateTicketNumber(),
      slaDeadline,
      createdById: actor.userId,
      branchId: actor.branchId ?? null,
      bankId: actor.bankId,
    })
    return this.complaintsRepository.save(complaint)
  }

  async findAll(actor: { userId: number; bankId: number; branchId?: number; role: string }): Promise<Complaint[]> {
    const query = this.complaintsRepository.createQueryBuilder('c')
      .where('c.bankId = :bankId', { bankId: actor.bankId })
      .orderBy('c.createdAt', 'DESC')
      .take(200)

    if (actor.branchId && ['customer-service', 'branch-manager'].includes(actor.role)) {
      query.andWhere('c.branchId = :branchId', { branchId: actor.branchId })
    }

    return query.getMany()
  }

  async escalate(id: number, actor: { userId: number; bankId: number; role: string }): Promise<Complaint> {
    const complaint = await this.complaintsRepository.findOne({ where: { id, bankId: actor.bankId } })
    if (!complaint) throw new NotFoundException('Complaint not found.')
    await this.complaintsRepository.update(id, { status: ComplaintStatus.ESCALATED })
    return { ...complaint, status: ComplaintStatus.ESCALATED }
  }

  async resolve(id: number, resolutionNote: string, actor: { userId: number; bankId: number }): Promise<Complaint> {
    const complaint = await this.complaintsRepository.findOne({ where: { id, bankId: actor.bankId } })
    if (!complaint) throw new NotFoundException('Complaint not found.')
    await this.complaintsRepository.update(id, {
      status: ComplaintStatus.RESOLVED,
      resolvedAt: new Date(),
      resolutionNote,
    })
    return { ...complaint, status: ComplaintStatus.RESOLVED }
  }
}
