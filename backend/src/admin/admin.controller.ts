import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { AdminService } from './admin.service'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../users/entities/user.entity'

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // --- Employee management ---

  @Post('employees')
  @HttpCode(HttpStatus.CREATED)
  createEmployee(@Body() dto: CreateEmployeeDto, @Request() req) {
    return this.adminService.createEmployee(dto, req.user)
  }

  @Get('employees')
  getEmployees(@Request() req) {
    return this.adminService.getEmployees(req.user)
  }

  @Patch('employees/:id/deactivate')
  deactivateEmployee(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.adminService.deactivateEmployee(id, req.user)
  }

  @Patch('employees/:id/activate')
  activateEmployee(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.adminService.activateEmployee(id, req.user)
  }

  @Patch('employees/:id/reset-otp')
  resetOtp(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.adminService.resetOtp(id, req.user)
  }

  @Patch('employees/:id/role')
  updateEmployeeRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeRoleDto, @Request() req) {
    return this.adminService.updateEmployeeRole(id, dto, req.user)
  }
}
