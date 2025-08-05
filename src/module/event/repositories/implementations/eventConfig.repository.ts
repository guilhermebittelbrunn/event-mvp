import { Injectable } from '@nestjs/common';
import { EventConfigModel } from '@prisma/client';

import EventConfig from '../../domain/eventConfig';
import EventConfigMapper from '../../mappers/eventConfig.mapper';
import { IEventConfigRepository } from '../eventConfig.repository.interface';

import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class EventConfigRepository
  extends BaseRepository<'eventConfigModel', EventConfig, EventConfigModel>
  implements IEventConfigRepository
{
  mapper = EventConfigMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('eventConfigModel', prisma, als);
  }
}
