import { Injectable } from '@nestjs/common';
import { MemoryModel } from '@prisma/client';

import Memory from '../../domain/memory/memory';
import MemoryMapper from '../../mappers/memory.mapper';
import { IMemoryRepository } from '../memory.repository.interface';

import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class MemoryRepository
  extends BaseRepository<'memoryModel', Memory, MemoryModel>
  implements IMemoryRepository
{
  mapper = MemoryMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('memoryModel', prisma, als);
  }

  async list(query?: PaginationQuery): Promise<PaginatedResult<Memory>> {
    const { page, take, skip } = this.getPaginationParams(query);

    const [memories, total] = await Promise.all([
      await this.manager().findMany({ skip, take }),
      await this.manager().count(),
    ]);

    return {
      data: memories.map(this.mapper.toDomain),
      meta: this.buildPaginationMeta(total, page, take),
    };
  }
}
