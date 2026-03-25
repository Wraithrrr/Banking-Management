import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BanksService } from './banks.service'
import { BanksController } from './banks.controller'
import { Bank } from './entities/bank.entity'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Bank, User])],
  providers: [BanksService],
  controllers: [BanksController],
  exports: [BanksService],
})
export class BanksModule {}
