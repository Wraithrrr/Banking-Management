import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common'
import { ZakatService } from './zakat.service'
import { CreateZakatDto } from './dto/zakat.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('zakat')
@UseGuards(JwtAuthGuard)
export class ZakatController {
  constructor(private zakatService: ZakatService) {}

  @Get('summary')
  getSummary(@Request() req) {
    return this.zakatService.getSummary(req.user.bankId)
  }

  @Get()
  findAll(@Request() req) {
    return this.zakatService.findAll(req.user.bankId)
  }

  @Post()
  create(@Body() dto: CreateZakatDto, @Request() req) {
    return this.zakatService.create(dto, req.user)
  }
}
