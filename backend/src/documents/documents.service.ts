import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Document, DocumentCategory } from './entities/document.entity'

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(
    file: Express.Multer.File,
    dto: { title: string; description?: string; category: DocumentCategory; entityType?: string; entityId?: number },
    actor: { userId: number; bankId: number; branchId?: number; name?: string },
  ): Promise<Document> {
    const doc = this.documentsRepository.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      originalName: file.originalname,
      filePath: file.path.replace(/\\/g, '/'),
      fileSize: file.size,
      mimeType: file.mimetype,
      entityType: dto.entityType ?? null,
      entityId: dto.entityId ? Number(dto.entityId) : null,
      uploadedById: actor.userId,
      uploadedByName: actor.name ?? 'Unknown',
      bankId: actor.bankId,
      branchId: actor.branchId ?? null,
    })
    return this.documentsRepository.save(doc)
  }

  async findAll(
    actor: { bankId: number; branchId?: number; role: string },
    filters?: { category?: string; entityType?: string; entityId?: number; search?: string },
  ): Promise<Document[]> {
    const query = this.documentsRepository
      .createQueryBuilder('doc')
      .where('doc.bankId = :bankId', { bankId: actor.bankId })
      .orderBy('doc.createdAt', 'DESC')
      .take(200)

    if (filters?.category) query.andWhere('doc.category = :category', { category: filters.category })
    if (filters?.entityType) query.andWhere('doc.entityType = :entityType', { entityType: filters.entityType })
    if (filters?.entityId) query.andWhere('doc.entityId = :entityId', { entityId: filters.entityId })
    if (filters?.search) {
      query.andWhere('(doc.title ILIKE :s OR doc.description ILIKE :s OR doc.originalName ILIKE :s)', {
        s: `%${filters.search}%`,
      })
    }

    // Branch-scoped roles only see their branch documents (except general/hr/compliance which are bank-wide)
    if (actor.branchId && ['branch-manager', 'teller', 'credit-officer', 'account-officer'].includes(actor.role)) {
      query.andWhere('(doc.branchId = :branchId OR doc.branchId IS NULL)', { branchId: actor.branchId })
    }

    return query.getMany()
  }

  async findOne(id: number, actor: { bankId: number }): Promise<Document> {
    const doc = await this.documentsRepository.findOne({ where: { id, bankId: actor.bankId } })
    if (!doc) throw new NotFoundException('Document not found.')
    return doc
  }

  async remove(id: number, actor: { userId: number; bankId: number; role: string }): Promise<void> {
    const doc = await this.findOne(id, actor)
    // Only uploader or admin/owner/compliance/internal-control can delete
    const canDelete = ['admin', 'owner', 'compliance', 'internal-control'].includes(actor.role) || doc.uploadedById === actor.userId
    if (!canDelete) throw new ForbiddenException('You cannot delete this document.')
    await this.documentsRepository.delete(id)
  }
}
