import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { BranchesService } from './branches.service'
import { CreateBranchDto } from './dto/create-branch.dto'
import { AssignStaffDto } from './dto/assign-staff.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('admin/branches')
@UseGuards(JwtAuthGuard)
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBranch(@Body() dto: CreateBranchDto, @Request() req) {
    return this.branchesService.createBranch(dto, req.user)
  }

  @Get()
  getBranches(@Request() req) {
    return this.branchesService.getBranches(req.user)
  }

  @Post(':id/assign-staff')
  assignStaff(@Param('id', ParseIntPipe) branchId: number, @Body() dto: AssignStaffDto, @Request() req) {
    return this.branchesService.assignStaff(branchId, dto, req.user)
  }

  @Get(':id/staff')
  getBranchStaff(@Param('id', ParseIntPipe) branchId: number, @Request() req) {
    return this.branchesService.getBranchStaff(branchId, req.user)
  }
}
