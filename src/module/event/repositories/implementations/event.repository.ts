import { Inject, Injectable } from '@nestjs/common';
import { EventModel, Prisma } from '@prisma/client';
import { isEmpty } from 'class-validator';

import Event from '../../domain/event/event';
import EventSlug from '../../domain/event/eventSlug';
import EventMapper from '../../mappers/event.mapper';
import { IEventRepository, ListEventByQuery } from '../event.repository.interface';
import { IEventAccessRepository, IEventAccessRepositorySymbol } from '../eventAccess.repository.interface';
import { IEventConfigRepository, IEventConfigRepositorySymbol } from '../eventConfig.repository.interface';

import {
  IPaymentRepository,
  IPaymentRepositorySymbol,
} from '@/module/billing/repositories/payment.repository.interface';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { PaginatedResult } from '@/shared/core/infra/pagination.interface';
import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { filledArray } from '@/shared/core/utils/undefinedHelpers';
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
    @Inject(IPaymentRepositorySymbol) private readonly paymentRepo: IPaymentRepository,
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

  async update(event: Event): Promise<string> {
    const rawId = await super.update(event);

    if (filledArray(event.accesses.items)) {
      await this.eventAccessRepo.saveMany(event.accesses);
    }

    if (event.payment) {
      await this.paymentRepo.update(event.payment);
    }

    return rawId;
  }

  async findCompleteById(id: GenericId): Promise<Event | null> {
    const event = await this.manager().findUnique({
      where: { id: UniqueEntityID.raw(id) },
      include: { config: true, accesses: true, file: true, payment: true },
    });

    return this.mapper.toDomainOrNull(event);
  }

  async list(query: ListEventByQuery = {}): Promise<PaginatedResult<Event>> {
    const { where, ordination, skip, take, page } = this.buildList(query);

    const [events, total] = await Promise.all([
      await this.manager().findMany({
        skip,
        take,
        where,
        include: { file: true, memories: true, payment: true },
        orderBy: ordination,
      }),
      await this.manager().count({ where }),
    ]);

    return {
      data: events.map(this.mapper.toDomain),
      meta: this.buildPaginationMeta(total, page, take),
    };
  }

  /** @todo create a new query only to "dashboard" and not to the list */
  async listForAdmin(query: ListEventByQuery = {}): Promise<PaginatedResult<Event>> {
    const { where, ordination, skip, take, page } = this.buildList(query);

    const [events, total] = await Promise.all([
      await this.manager().findMany({
        skip,
        take,
        where,
        include: { file: true, user: true, memories: true, payment: true },
        orderBy: ordination,
      }),
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

  private buildList(query: ListEventByQuery) {
    const { userId, term, orderBy, order, dateType, startDate, endDate, statuses } = query;
    const { page, take, skip } = this.getPaginationParams(query);

    const filterDate = dateType && Object.keys(Prisma.EventModelScalarFieldEnum).includes(dateType);

    const where: Prisma.EventModelWhereInput = {
      ...(!isEmpty(userId) && { userId: UniqueEntityID.raw(userId) }),
      ...(!isEmpty(term) && {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { slug: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      }),
      ...(filterDate && {
        ...(startDate && { [dateType]: { gte: startDate } }),
        ...(endDate && { [dateType]: { lte: endDate } }),
      }),
      ...(!isEmpty(statuses) && { status: { in: statuses } }),
    };

    let ordination: Prisma.EventModelOrderByWithRelationInput;

    if (orderBy && order && Object.keys(Prisma.EventModelScalarFieldEnum).includes(orderBy)) {
      ordination = { [orderBy]: order };
    }

    return { where, ordination, skip, take, page };
  }

  async findByPaymentIntegratorId(integratorId: string) {
    const event = await this.manager().findFirst({
      include: { payment: true },
      where: { payment: { integratorId } },
    });

    return this.mapper.toDomainOrNull(event);
  }
}
