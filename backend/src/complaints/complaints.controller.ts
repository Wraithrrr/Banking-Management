import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common'
import { ComplaintsService, CreateComplaintDto } from './complaints.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  create(@Body() dto: CreateComplaintDto, @Request() req) {
    return this.complaintsService.create(dto, req.user)
  }

  @Get()
  findAll(@Request() req) {
    return this.complaintsService.findAll(req.user)
  }

  @Patch(':id/escalate')
  escalate(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.complaintsService.escalate(id, req.user)
  }

  @Patch(':id/resolve')
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Body('resolutionNote') resolutionNote: string,
    @Request() req,
  ) {
    return this.complaintsService.resolve(id, resolutionNote, req.user)
  }
}
