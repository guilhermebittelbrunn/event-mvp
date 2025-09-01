import { Inject, Injectable } from '@nestjs/common';
import { EventModel, Prisma } from '@prisma/client';
import { isEmpty } from 'class-validator';

import Event from '../../domain/event/event';
import EventSlug from '../../domain/event/eventSlug';
import EventMapper from '../../mappers/event.mapper';
import { IEventRepository, ListEventByQuery } from '../event.repository.interface';
import { IEventAccessRepository, IEventAccessRepositorySymbol } from '../eventAccess.repository.interface';
import { IEventConfigRepository, IEventConfigRepositorySymbol } from '../eventConfig.repository.interface';

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
  usesSoftDelete = true;

  constructor(
    @Inject(IEventConfigRepositorySymbol) private readonly eventConfigRepo: IEventConfigRepository,
    @Inject(IEventAccessRepositorySymbol) private readonly eventAccessRepo: IEventAccessRepository,
    protected readonly prisma: PrismaService,
    als: Als,
  ) {
    super('eventModel', prisma, als);
  }

  async save(domain: Event): Promise<Event> {
    const event = await super.create(domain);

    if (!isEmpty(domain.config)) {
      event.config = await this.eventConfigRepo.create(domain.config);
    }

    if (!isEmpty(domain.accesses)) {
      await this.eventAccessRepo.saveMany(domain.accesses);
      event.accesses = domain.accesses;
    }

    return event;
  }

  async update(domain: Event): Promise<string> {
    const rawId = await super.update(domain);

    await this.eventAccessRepo.saveMany(domain.accesses);

    return rawId;
  }

  async findCompleteById(id: GenericId): Promise<Event | null> {
    const event = await this.manager().findUnique({
      where: { id: UniqueEntityID.raw(id) },
      include: { config: true, accesses: true, file: true },
    });

    return this.mapper.toDomainOrNull(event);
  }

  async list(query: ListEventByQuery = {}): Promise<PaginatedResult<Event>> {
    const { userId, term, orderBy, order, dateType, startDate, endDate } = query;
    const { page, take, skip } = this.getPaginationParams(query);

    let where: Prisma.EventModelWhereInput = {
      ...(!isEmpty(userId) && { userId: UniqueEntityID.raw(userId) }),
      ...(!isEmpty(term) && {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { slug: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      }),
    };

    if (dateType && Object.keys(Prisma.EventModelScalarFieldEnum).includes(dateType)) {
      where = {
        ...where,
        ...(startDate && { [dateType]: { gte: startDate } }),
        ...(endDate && { [dateType]: { lte: endDate } }),
      };
    }

    let ordination: Prisma.EventModelOrderByWithRelationInput;

    if (orderBy && Object.keys(Prisma.EventModelScalarFieldEnum).includes(orderBy)) {
      ordination = { ...(orderBy && order && { [orderBy]: order }) };
    }

    const [events, total] = await Promise.all([
      await this.manager().findMany({ skip, take, where, include: { file: true }, orderBy: ordination }),
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
      include: { config: true, accesses: true, file: true },
    });

    return this.mapper.toDomainOrNull(event);
  }
}
