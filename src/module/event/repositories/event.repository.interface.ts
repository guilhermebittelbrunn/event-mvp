import Event from '../domain/event/event';
import EventSlug from '../domain/event/eventSlug';

import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { GenericId } from '@/shared/types/common';

export interface ListEventByQuery extends PaginationQuery {
  userId?: string;
}

export interface IEventRepository extends IBaseRepository<Event> {
  findCompleteById(id: GenericId): SingleEntityResponse<Event>;
  list(query?: ListEventByQuery): Promise<PaginatedResult<Event>>;
  findBySlug(slug: string | EventSlug): SingleEntityResponse<Event>;
}

export const IEventRepositorySymbol = Symbol('IEventRepository');
