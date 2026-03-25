import { Controller, Post, Body, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { SetPasswordDto } from './dto/set-password.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto)
  }

  @Post('set-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async setPassword(@Body() dto: SetPasswordDto, @Request() req) {
    return this.authService.setPassword(req.user.userId, dto)
  }
}
