import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoanApplication } from './entities/loan-application.entity'
import { LoanRepayment } from './entities/loan-repayment.entity'
import { LoansService } from './loans.service'
import { LoansController } from './loans.controller'
import { AuditLogModule } from '../audit-log/audit-log.module'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [TypeOrmModule.forFeature([LoanApplication, LoanRepayment]), AuditLogModule, NotificationsModule],
  providers: [LoansService],
  controllers: [LoansController],
  exports: [LoansService],
})
export class LoansModule {}
