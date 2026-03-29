import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeeSalary } from './entities/employee-salary.entity'
import { PayrollRun } from './entities/payroll-run.entity'
import { User } from '../users/entities/user.entity'
import { PayrollService } from './payroll.service'
import { PayrollController } from './payroll.controller'

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSalary, PayrollRun, User])],
  providers: [PayrollService],
  controllers: [PayrollController],
  exports: [PayrollService],
})
export class PayrollModule {}
