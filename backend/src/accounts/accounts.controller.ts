import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  create(@Body() dto: CreateAccountDto, @Request() req) {
    return this.accountsService.create(dto, req.user)
  }

  @Get()
  findAll(@Request() req) {
    return this.accountsService.findAll(req.user)
  }

  @Get('number/:accountNumber')
  findByAccountNumber(@Param('accountNumber') accountNumber: string, @Request() req) {
    return this.accountsService.findByAccountNumber(accountNumber, req.user)
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId', ParseIntPipe) customerId: number, @Request() req) {
    return this.accountsService.findByCustomer(customerId, req.user)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.accountsService.findById(id, req.user)
  }
}
