import { Injectable } from '@nestjs/common';
import { FileModel } from '@prisma/client';

import File from '../../domain/file/file';
import FileMapper from '../../mappers/file.mapper';
import { IFileRepository } from '../file.repository.interface';

import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class FileRepository extends BaseRepository<'fileModel', File, FileModel> implements IFileRepository {
  mapper = FileMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('fileModel', prisma, als);
  }
}
