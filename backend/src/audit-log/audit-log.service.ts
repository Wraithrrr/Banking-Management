import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { AuditLog } from './entities/audit-log.entity'

export interface AuditLogEntry {
  action: string
  entityType: string
  entityId: number
  actorId: number
  actorRole: string
  actorName: string
  description: string
  metadata?: Record<string, any> | string | null
  bankId: number
  branchId?: number | null
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(entry: AuditLogEntry): Promise<void> {
    const record = this.auditLogRepository.create({
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      actorId: entry.actorId,
      actorRole: entry.actorRole,
      actorName: entry.actorName,
      description: entry.description,
      metadata: entry.metadata
        ? typeof entry.metadata === 'string'
          ? entry.metadata
          : JSON.stringify(entry.metadata)
        : null,
      bankId: entry.bankId,
      branchId: entry.branchId ?? null,
    })
    await this.auditLogRepository.save(record)
  }

  async findAll(bankId: number, limit = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { bankId },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  async findExceptions(bankId: number): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('log')
      .where('log.bankId = :bankId', { bankId })
      .andWhere(
        '(log.action LIKE :declined OR log.action LIKE :rejected OR log.action LIKE :flagged)',
        {
          declined: '%DECLINED%',
          rejected: '%REJECTED%',
          flagged: '%FLAGGED%',
        },
      )
      .orderBy('log.createdAt', 'DESC')
      .take(50)
      .getMany()
  }
}
