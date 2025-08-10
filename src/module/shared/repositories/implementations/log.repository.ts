import { Injectable } from '@nestjs/common';
import { LogModel } from '@prisma/client';

import Log from '../../domain/log/log';
import LogMapper from '../../mappers/log.mapper';
import { ILogRepository } from '../log.repository.interface';

import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class LogRepository extends BaseRepository<'logModel', Log, LogModel> implements ILogRepository {
  mapper = LogMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('logModel', prisma, als);
  }
}
