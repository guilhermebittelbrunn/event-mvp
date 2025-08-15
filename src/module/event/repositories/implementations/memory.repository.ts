import { Injectable } from '@nestjs/common';
import { MemoryModel } from '@prisma/client';

import Memory from '../../domain/memory/memory';
import MemoryMapper from '../../mappers/memory.mapper';
import { IMemoryRepository } from '../memory.repository.interface';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';
import { GenericId } from '@/shared/types/common';

@Injectable()
export class MemoryRepository
  extends BaseRepository<'memoryModel', Memory, MemoryModel>
  implements IMemoryRepository
{
  mapper = MemoryMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('memoryModel', prisma, als);
  }

  async findAllByIds(ids: GenericId[]): Promise<Memory[]> {
    const memories = await this.manager().findMany({
      where: { id: { in: ids.map(UniqueEntityID.raw) } },
      include: { file: true },
    });
    return memories.map(this.mapper.toDomain);
  }

  async findCompleteById(id: GenericId): Promise<Memory> {
    const memory = await this.manager().findUnique({
      where: { id: UniqueEntityID.raw(id) },
      include: {
        file: true,
      },
    });
    return this.mapper.toDomainOrNull(memory);
  }

  async listWithFiles(query?: PaginationQuery): Promise<PaginatedResult<Memory>> {
    const { page, take, skip } = this.getPaginationParams(query);

    const [memories, total] = await Promise.all([
      await this.manager().findMany({ skip, take, include: { file: true } }),
      await this.manager().count(),
    ]);

    return {
      data: memories.map(this.mapper.toDomain),
      meta: this.buildPaginationMeta(total, page, take),
    };
  }

  async findAllForDownload(ids: GenericId[]): Promise<Memory[]> {
    const memories = await this.manager().findMany({
      where: { id: { in: ids.map(UniqueEntityID.raw) } },
      include: { file: true },
    });

    return memories.map(this.mapper.toDomain);
  }
}
