import { Inject, Injectable } from '@nestjs/common';

import { ListEventsDTO } from './dto/listEvents.dto';

import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';

@Injectable()
export class ListEventsService {
  constructor(@Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository) {}

  async execute(query?: ListEventsDTO & { isAdmin?: boolean }) {
    return !!query.isAdmin ? this.eventRepo.listForAdmin(query) : this.eventRepo.list(query);
  }
}
