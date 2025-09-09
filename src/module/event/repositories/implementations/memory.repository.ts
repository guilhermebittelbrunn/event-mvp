import { Injectable } from '@nestjs/common';
import { MemoryModel, Prisma } from '@prisma/client';

import Memory from '../../domain/memory/memory';
import MemoryMapper from '../../mappers/memory.mapper';
import { IMemoryRepository, ListMemoriesWithFilesByQuery } from '../memory.repository.interface';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { PaginatedResult } from '@/shared/core/infra/pagination.interface';
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

  async listWithFiles(
    eventId: GenericId,
    query?: ListMemoriesWithFilesByQuery,
  ): Promise<PaginatedResult<Memory>> {
    const { orderBy, order } = query;
    const { page, take, skip } = this.getPaginationParams(query);

    const where: Prisma.MemoryModelWhereInput = {
      eventId: UniqueEntityID.raw(eventId),
    };

    let ordination: Prisma.MemoryModelOrderByWithRelationInput;

    if (orderBy && Object.keys(Prisma.MemoryModelScalarFieldEnum).includes(orderBy)) {
      ordination = { ...(orderBy && order && { [orderBy]: order }) };
    }

    const [memories, total] = await Promise.all([
      await this.manager().findMany({ skip, take, where, include: { file: true }, orderBy: ordination }),
      await this.manager().count({ where }),
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
