import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { SetPasswordDto } from './dto/set-password.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email)
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials')
    }
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Contact your IT Administrator.')
    }

    const payload = { sub: user.id, email: user.email, role: user.role, bankId: user.bankId, branchId: user.branchId ?? null }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        bankId: user.bankId,
        branchId: user.branchId ?? null,
      },
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException('Invalid email or OTP.')
    }
    if (!user.otpCode || user.otpCode !== dto.otp) {
      throw new UnauthorizedException('Invalid OTP. Please check and try again.')
    }
    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      throw new BadRequestException('OTP has expired. Contact your IT Administrator for a new one.')
    }

    // Issue a short-lived token for the set-password step
    const payload = { sub: user.id, email: user.email, purpose: 'set-password' }
    return {
      token: this.jwtService.sign(payload, { expiresIn: '15m' }),
    }
  }

  async setPassword(userId: number, dto: SetPasswordDto) {
    const user = await this.usersService.findById(userId)
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      otpCode: null,
      otpExpiresAt: null,
      isFirstLogin: false,
    })

    return { message: 'Password set successfully. You can now sign in.' }
  }
}
