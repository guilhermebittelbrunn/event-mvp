import { Injectable } from '@nestjs/common';
import { EventModel, Prisma } from '@prisma/client';
import { isEmpty } from 'class-validator';

import Event from '../../domain/event/event';
import EventSlug from '../../domain/event/eventSlug';
import EventMapper from '../../mappers/event.mapper';
import { IEventRepository, ListEventByQuery } from '../event.repository.interface';
import { IEventConfigRepository } from '../eventConfig.repository.interface';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { PaginatedResult } from '@/shared/core/infra/pagination.interface';
import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';
import { GenericId } from '@/shared/types/common';

@Injectable()
export class EventRepository
  extends BaseRepository<'eventModel', Event, EventModel>
  implements IEventRepository
{
  mapper = EventMapper;

  constructor(
    private readonly eventConfigRepo: IEventConfigRepository,
    prisma: PrismaService,
    als: Als,
  ) {
    super('eventModel', prisma, als);
  }

  async save(domain: Event): Promise<Event> {
    const event = await this.create(domain);

    if (!isEmpty(domain.config)) {
      event.config = await this.eventConfigRepo.create(domain.config);
    }

    return event;
  }

  async findCompleteById(id: GenericId): Promise<Event | null> {
    const event = await this.manager().findUnique({
      where: { id: UniqueEntityID.raw(id) },
      include: {
        config: true,
      },
    });

    return this.mapper.toDomainOrNull(event);
  }

  async list(query: ListEventByQuery = {}): Promise<PaginatedResult<Event>> {
    const { userId } = query;
    const { page, take, skip } = this.getPaginationParams(query);

    const where: Prisma.EventModelWhereInput = {
      ...(!isEmpty(userId) && { userId }),
    };

    const [events, total] = await Promise.all([
      await this.manager().findMany({ skip, take, where }),
      await this.manager().count({ where }),
    ]);

    return {
      data: events.map(this.mapper.toDomain),
      meta: this.buildPaginationMeta(total, page, take),
    };
  }

  async findBySlug(slug: string | EventSlug): Promise<Event | null> {
    const slugRaw = slug instanceof EventSlug ? slug.value : slug;

    const event = await this.manager().findUnique({
      where: { slug: slugRaw },
    });

    return this.mapper.toDomainOrNull(event);
  }
}
