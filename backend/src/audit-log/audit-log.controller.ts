import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AuditLogService } from './audit-log.service'

@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.auditLogService.findAll(req.user.bankId)
  }

  @Get('exceptions')
  findExceptions(@Req() req: any) {
    return this.auditLogService.findExceptions(req.user.bankId)
  }
}
