import { Injectable } from '@nestjs/common';
import { EventAccessModel } from '@prisma/client';

import EventAccess from '../../domain/eventAccess/eventAccess';
import { EventAccesses } from '../../domain/eventAccess/eventAccesses';
import EventAccessMapper from '../../mappers/eventAccess.mapper';
import { IEventAccessRepository } from '../eventAccess.repository.interface';

import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { filledArray } from '@/shared/core/utils/undefinedHelpers';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class EventAccessRepository
  extends BaseRepository<'eventAccessModel', EventAccess, EventAccessModel>
  implements IEventAccessRepository
{
  mapper = EventAccessMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('eventAccessModel', prisma, als);
  }

  async saveMany(accesses: EventAccesses): Promise<void> {
    if (filledArray(accesses.newItems)) {
      await this.createBulk(accesses.newItems);
    }

    if (filledArray(accesses.removedItems)) {
      await this.deleteBulk(accesses.removedItems.map(({ id }) => id));
    }

    if (filledArray(accesses.updatedItems)) {
      await this.updateBulk(accesses.updatedItems);
    }
  }
}
