import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common'
import { PayrollService } from './payroll.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  // ── Salary Setup (Admin only) ─────────────────────────────────────────────
  @Post('salaries/:userId')
  setSalary(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: {
      basicSalary: number; housingAllowance?: number; transportAllowance?: number;
      otherAllowances?: number; pension?: number; incomeTax?: number; otherDeductions?: number;
    },
    @Request() req,
  ) {
    return this.payrollService.setSalary(userId, body, req.user)
  }

  @Get('salaries')
  getSalaries(@Request() req) {
    return this.payrollService.getSalaries(req.user)
  }

  // ── Payroll Runs ──────────────────────────────────────────────────────────
  @Post('run')
  runPayroll(@Body() body: { period: string }, @Request() req) {
    return this.payrollService.runPayroll(body.period, req.user)
  }

  @Get('runs')
  getPayrollRuns(@Request() req) {
    return this.payrollService.getPayrollRuns(req.user)
  }

  @Get('runs/:id')
  getPayrollRun(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.payrollService.getPayrollRun(id, req.user)
  }

  @Patch('runs/:id/approve')
  approvePayroll(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.payrollService.approvePayroll(id, req.user)
  }

  @Patch('runs/:id/mark-paid')
  markPaid(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.payrollService.markPaid(id, req.user)
  }
}
