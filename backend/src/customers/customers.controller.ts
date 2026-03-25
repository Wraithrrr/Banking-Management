import {
  Controller, Get, Post, Patch, Body, Param, Query,
  ParseIntPipe, UseGuards, Request, UseInterceptors, UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('kycDocs', 5, {
    storage: diskStorage({
      destination: './uploads/kyc',
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + extname(file.originalname))
      },
    }),
    fileFilter: (_req, file, cb) => {
      const allowed = /jpeg|jpg|png|pdf/
      const ok = allowed.test(extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)
      cb(null, ok)
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  }))
  async create(
    @Body() dto: CreateCustomerDto,
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const customer = await this.customersService.create(dto, req.user)
    if (files && files.length > 0) {
      const paths = files.map(f => f.path.replace(/\\/g, '/'))
      await this.customersService.attachDocumentPaths(customer.id, paths, req.user)
    }
    return customer
  }

  @Get()
  findAll(@Request() req, @Query('search') search?: string) {
    return this.customersService.findAll(req.user, search)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.customersService.findOne(id, req.user)
  }

  @Patch(':id/approve-kyc')
  approveKyc(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.customersService.approveKyc(id, req.user)
  }
}
