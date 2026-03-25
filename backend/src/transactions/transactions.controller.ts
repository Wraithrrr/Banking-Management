import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { DepositDto, WithdrawalDto, TransferDto } from './dto/transaction.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Body() dto: DepositDto, @Request() req) {
    return this.transactionsService.deposit(dto, req.user)
  }

  @Post('withdrawal')
  withdrawal(@Body() dto: WithdrawalDto, @Request() req) {
    return this.transactionsService.withdrawal(dto, req.user)
  }

  @Post('transfer')
  transfer(@Body() dto: TransferDto, @Request() req) {
    return this.transactionsService.transfer(dto, req.user)
  }

  @Get()
  findAll(
    @Request() req,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('date') date?: string,
  ) {
    return this.transactionsService.findAll(req.user, { status, type, date })
  }

  @Get('pending')
  getPending(@Request() req) {
    return this.transactionsService.getPending(req.user)
  }

  @Get('vault')
  getVault(@Request() req) {
    return this.transactionsService.getVault(req.user)
  }

  @Get('vault/all')
  getAllVaults(@Request() req) {
    return this.transactionsService.getAllVaults(req.user)
  }

  @Patch(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.transactionsService.approve(id, req.user)
  }
}
