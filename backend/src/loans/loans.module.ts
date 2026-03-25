import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoanApplication } from './entities/loan-application.entity'
import { LoanRepayment } from './entities/loan-repayment.entity'
import { LoansService } from './loans.service'
import { LoansController } from './loans.controller'

@Module({
  imports: [TypeOrmModule.forFeature([LoanApplication, LoanRepayment])],
  providers: [LoansService],
  controllers: [LoansController],
  exports: [LoansService],
})
export class LoansModule {}
