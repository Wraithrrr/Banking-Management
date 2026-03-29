import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoanApplication } from '../loans/entities/loan-application.entity'
import { LoanRepayment } from '../loans/entities/loan-repayment.entity'
import { Customer } from '../customers/entities/customer.entity'
import { Account } from '../accounts/entities/account.entity'
import { Branch } from '../branches/entities/branch.entity'
import { User } from '../users/entities/user.entity'
import { OwnerService } from './owner.service'
import { OwnerController } from './owner.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanApplication, LoanRepayment, Customer, Account, Branch, User]),
  ],
  providers: [OwnerService],
  controllers: [OwnerController],
})
export class OwnerModule {}
