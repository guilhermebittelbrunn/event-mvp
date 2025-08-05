import { Inject, Injectable } from '@nestjs/common';

import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';

@Injectable()
export class ListEventsService {
  constructor(@Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository) {}

  async execute(query?: PaginationQuery) {
    return this.eventRepo.list(query);
  }
}
