import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from './entities/transaction.entity'
import { VaultBalance } from './entities/vault-balance.entity'
import { TransactionsService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
import { AccountsModule } from '../accounts/accounts.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, VaultBalance]),
    AccountsModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
