import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common'
import { LoansService } from './loans.service'
import { CreateLoanDto, DecisionDto } from './dto/loan.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto, @Request() req) {
    return this.loansService.create(dto, req.user)
  }

  @Get()
  findAll(@Request() req) {
    return this.loansService.findAll(req.user)
  }

  @Get('portfolio-summary')
  getPortfolio(@Request() req) {
    return this.loansService.getPortfolioSummary(req.user)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.loansService.findOne(id, req.user)
  }

  @Patch(':id/bm-decision')
  bmDecision(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DecisionDto & { approve: boolean },
    @Request() req,
  ) {
    return this.loansService.bmDecision(id, body.approve, body, req.user)
  }

  @Patch(':id/hoc-decision')
  hocDecision(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DecisionDto & { approve: boolean },
    @Request() req,
  ) {
    return this.loansService.hocDecision(id, body.approve, body, req.user)
  }

  @Patch(':id/disburse')
  disburse(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.loansService.disburse(id, req.user)
  }
}
