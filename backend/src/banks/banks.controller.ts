import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { BanksService } from './banks.service'
import { RegisterBankDto } from './dto/register-bank.dto'

@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterBankDto) {
    return this.banksService.register(dto)
  }
}
