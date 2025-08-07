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

  async findCompleteById(id: string): Promise<Memory> {
    const [memory, file] = await Promise.all([
      this.manager().findUnique({ where: { id } }),
      this.manager('fileModel').findFirst({ where: { entityId: id } }),
    ]);

    if (!memory) {
      return null;
    }

    return this.mapper.toDomain({ ...memory, file });
  }

  async listWithFiles(query?: PaginationQuery): Promise<PaginatedResult<Memory>> {
    const { page, take, skip } = this.getPaginationParams(query);

    const [memories, total] = await Promise.all([
      await this.manager().findMany({ skip, take }),
      await this.manager().count(),
    ]);

    /**
     * @todo: improve this query to get the files in a single query, use eager loading
     */
    const files = await this.manager('fileModel').findMany({
      where: { entityId: { in: memories.map(({ id }) => id) } },
    });

    const memoriesWithFiles = memories.map((memory) => ({
      ...memory,
      file: files.find(({ entityId }) => entityId === memory.id),
    }));

    return {
      data: memoriesWithFiles.map(this.mapper.toDomain),
      meta: this.buildPaginationMeta(total, page, take),
    };
  }
}
