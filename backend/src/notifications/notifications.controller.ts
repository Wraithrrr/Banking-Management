import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req) {
    return this.notificationsService.findForUser(req.user)
  }

  @Get('unread-count')
  unreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user)
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.notificationsService.markRead(id, req.user)
  }

  @Patch('mark-all-read')
  markAllRead(@Request() req) {
    return this.notificationsService.markAllRead(req.user)
  }
}
