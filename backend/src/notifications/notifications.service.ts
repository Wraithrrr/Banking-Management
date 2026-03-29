import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification, NotificationType } from './entities/notification.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(payload: {
    userId: number
    bankId: number
    type: NotificationType
    message: string
    relatedEntityId?: number
    relatedEntityType?: string
  }): Promise<Notification> {
    const notification = this.notificationsRepository.create(payload)
    return this.notificationsRepository.save(notification)
  }

  async findForUser(actor: { userId: number; bankId: number }): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId: actor.userId, bankId: actor.bankId },
      order: { createdAt: 'DESC' },
      take: 50,
    })
  }

  async markRead(id: number, actor: { userId: number }): Promise<void> {
    await this.notificationsRepository.update({ id, userId: actor.userId }, { isRead: true })
  }

  async markAllRead(actor: { userId: number; bankId: number }): Promise<void> {
    await this.notificationsRepository.update(
      { userId: actor.userId, bankId: actor.bankId, isRead: false },
      { isRead: true },
    )
  }

  async getUnreadCount(actor: { userId: number; bankId: number }): Promise<number> {
    return this.notificationsRepository.count({ where: { userId: actor.userId, bankId: actor.bankId, isRead: false } })
  }

  // Notify all users with a given role in the bank (optionally scoped to a branch)
  async notifyRole(params: {
    role: string
    bankId: number
    branchId?: number | null
    type: NotificationType
    message: string
    relatedEntityId?: number
    relatedEntityType?: string
  }): Promise<void> {
    try {
      const where: any = { bankId: params.bankId, role: params.role, isActive: true }
      if (params.branchId) where.branchId = params.branchId
      const users = await this.usersRepository.find({ where, select: ['id'] })
      if (users.length === 0) return
      const notifications = users.map(u =>
        this.notificationsRepository.create({
          userId: u.id,
          bankId: params.bankId,
          type: params.type,
          message: params.message,
          relatedEntityId: params.relatedEntityId,
          relatedEntityType: params.relatedEntityType,
        }),
      )
      await this.notificationsRepository.save(notifications)
    } catch { /* never crash on notification failure */ }
  }
}
