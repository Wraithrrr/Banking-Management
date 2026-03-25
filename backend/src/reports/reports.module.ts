import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from '../transactions/entities/transaction.entity'
import { VaultBalance } from '../transactions/entities/vault-balance.entity'
import { LoanApplication } from '../loans/entities/loan-application.entity'
import { Account } from '../accounts/entities/account.entity'
import { ReportsService } from './reports.service'
import { ReportsController } from './reports.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, VaultBalance, LoanApplication, Account])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
