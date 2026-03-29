import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ZakatTransaction } from './entities/zakat-transaction.entity'
import { ZakatService } from './zakat.service'
import { ZakatController } from './zakat.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ZakatTransaction])],
  providers: [ZakatService],
  controllers: [ZakatController],
  exports: [ZakatService],
})
export class ZakatModule {}
