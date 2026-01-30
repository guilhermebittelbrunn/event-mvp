import { EventModel } from '@prisma/client';

import Event from '../domain/event/event';
import EventSlug from '../domain/event/eventSlug';

import { PaginatedResult, PaginationOrderDateQuery } from '@/shared/core/infra/pagination.interface';
import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { EventStatusEnum } from '@/shared/types';
import { GenericId } from '@/shared/types/common';

export interface ListEventByQuery extends PaginationOrderDateQuery<EventModel> {
  userId?: string;
  statuses?: EventStatusEnum[];
}

export interface IEventRepository extends IBaseRepository<Event> {
  save(domain: Event): Promise<Event>;
  findCompleteById(id: GenericId): SingleEntityResponse<Event>;
  findBySlug(slug: string | EventSlug): SingleEntityResponse<Event>;
  findByPaymentIntegratorId(integratorId: string): SingleEntityResponse<Event>;
  list(query?: ListEventByQuery): Promise<PaginatedResult<Event>>;
  listForAdmin(query?: ListEventByQuery): Promise<PaginatedResult<Event>>;
}

export const IEventRepositorySymbol = Symbol('IEventRepository');
