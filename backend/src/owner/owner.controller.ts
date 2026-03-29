import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { OwnerService } from './owner.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('owner')
@UseGuards(JwtAuthGuard)
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Get('metrics')
  getMetrics(@Request() req) {
    return this.ownerService.getMetrics(req.user.bankId)
  }
}
