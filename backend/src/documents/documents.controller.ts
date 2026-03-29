import {
  Controller, Get, Post, Delete, Body, Param, Query,
  ParseIntPipe, UseGuards, Request, UseInterceptors,
  UploadedFile, BadRequestException, Res,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { Response } from 'express'
import { DocumentsService } from './documents.service'
import { DocumentCategory } from './entities/document.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

const ALLOWED_EXT = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|csv|txt/
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/documents',
      filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, unique + extname(file.originalname))
      },
    }),
    fileFilter: (_req, file, cb) => {
      const ok = ALLOWED_EXT.test(extname(file.originalname).toLowerCase())
      cb(ok ? null : new BadRequestException('Unsupported file type. Allowed: PDF, Word, Excel, CSV, images.'), ok)
    },
    limits: { fileSize: MAX_SIZE },
  }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description?: string; category: DocumentCategory; entityType?: string; entityId?: string },
    @Request() req,
  ) {
    if (!file) throw new BadRequestException('No file uploaded.')
    if (!body.title) throw new BadRequestException('Document title is required.')
    return this.documentsService.create(
      file,
      {
        title: body.title,
        description: body.description,
        category: body.category ?? DocumentCategory.GENERAL,
        entityType: body.entityType,
        entityId: body.entityId ? Number(body.entityId) : undefined,
      },
      { ...req.user, name: req.user.fullName ?? req.user.name },
    )
  }

  @Get()
  findAll(
    @Request() req,
    @Query('category') category?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('search') search?: string,
  ) {
    return this.documentsService.findAll(req.user, {
      category,
      entityType,
      entityId: entityId ? Number(entityId) : undefined,
      search,
    })
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.documentsService.findOne(id, req.user)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.documentsService.remove(id, req.user)
  }
}
