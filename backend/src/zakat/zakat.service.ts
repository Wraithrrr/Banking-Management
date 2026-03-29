import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ZakatTransaction, ZakatType, ZakatCategory } from './entities/zakat-transaction.entity'
import { CreateZakatDto } from './dto/zakat.dto'

@Injectable()
export class ZakatService {
  constructor(
    @InjectRepository(ZakatTransaction)
    private zakatRepository: Repository<ZakatTransaction>,
  ) {}

  async create(dto: CreateZakatDto, actor: { userId: number; bankId: number; role: string }): Promise<ZakatTransaction> {
    const record = this.zakatRepository.create({
      ...dto,
      amount: dto.amount.toFixed(2),
      recordedById: actor.userId,
      bankId: actor.bankId,
    })
    return this.zakatRepository.save(record)
  }

  async findAll(bankId: number): Promise<ZakatTransaction[]> {
    return this.zakatRepository.find({
      where: { bankId },
      order: { createdAt: 'DESC' },
    })
  }

  async getSummary(bankId: number) {
    const all = await this.zakatRepository.find({ where: { bankId } })

    const collected = all.filter(r => r.type === ZakatType.COLLECTED)
    const distributed = all.filter(r => r.type === ZakatType.DISTRIBUTED)

    const totalCollected = collected.reduce((sum, r) => sum + parseFloat(r.amount), 0)
    const totalDistributed = distributed.reduce((sum, r) => sum + parseFloat(r.amount), 0)
    const pendingDistribution = totalCollected - totalDistributed

    // Distribution breakdown by category (distributed records only)
    const categoryMap: Record<string, number> = {}
    for (const r of distributed) {
      categoryMap[r.category] = (categoryMap[r.category] ?? 0) + parseFloat(r.amount)
    }
    const byCategory = Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }))

    // Last 5 distributed transactions as recent projects
    const recentProjects = distributed
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    // Monthly trend — last 6 months (native Date math, no date-fns)
    const now = new Date()
    const monthlyTrend: { month: string; collected: number; distributed: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = d.getFullYear()
      const month = d.getMonth() // 0-indexed

      const label = `${year}-${String(month + 1).padStart(2, '0')}`

      const monthCollected = all
        .filter(r => {
          const rd = new Date(r.createdAt)
          return r.type === ZakatType.COLLECTED && rd.getFullYear() === year && rd.getMonth() === month
        })
        .reduce((sum, r) => sum + parseFloat(r.amount), 0)

      const monthDistributed = all
        .filter(r => {
          const rd = new Date(r.createdAt)
          return r.type === ZakatType.DISTRIBUTED && rd.getFullYear() === year && rd.getMonth() === month
        })
        .reduce((sum, r) => sum + parseFloat(r.amount), 0)

      monthlyTrend.push({ month: label, collected: monthCollected, distributed: monthDistributed })
    }

    return {
      totalCollected,
      totalDistributed,
      pendingDistribution,
      byCategory,
      recentProjects,
      monthlyTrend,
    }
  }
}
