import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily-transactions')
  dailySummary(@Request() req, @Query('date') date?: string) {
    return this.reportsService.dailyTransactionSummary(req.user, date)
  }

  @Get('loan-portfolio')
  loanPortfolio(@Request() req) {
    return this.reportsService.loanPortfolio(req.user)
  }

  @Get('account-statement/:accountNumber')
  accountStatement(
    @Param('accountNumber') accountNumber: string,
    @Request() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.accountStatement(accountNumber, req.user, from, to)
  }
}
