import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification, NotificationType } from './entities/notification.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
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
}
