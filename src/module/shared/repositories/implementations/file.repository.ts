import { Injectable } from '@nestjs/common';
import { FileModel } from '@prisma/client';

import File from '../../domain/file/file';
import FileMapper from '../../mappers/file.mapper';
import { IFileRepository } from '../file.repository.interface';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';
import { GenericId } from '@/shared/types/common';

@Injectable()
export class FileRepository extends BaseRepository<'fileModel', File, FileModel> implements IFileRepository {
  mapper = FileMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('fileModel', prisma, als);
  }

  /**
   * @note ensures that entity has only one file, otherwise the wrong file can be returned
   */
  async findByEntityId(entityId: GenericId): Promise<File | null> {
    const file = await this.prisma.fileModel.findFirst({
      where: {
        entityId: UniqueEntityID.raw(entityId),
      },
    });

    return this.mapper.toDomainOrNull(file);
  }

  async findAllByEntityId(entityIds: GenericId[]): Promise<File[]> {
    const files = await this.prisma.fileModel.findMany({
      where: {
        entityId: { in: entityIds.map((id) => UniqueEntityID.raw(id)) },
      },
    });

    return files.map(this.mapper.toDomain);
  }
}
