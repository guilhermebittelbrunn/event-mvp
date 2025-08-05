import { Inject, Injectable } from '@nestjs/common';

import DeleteEventErrors from './deleteEvent.error';

import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { EventStatusEnum } from '@/shared/types/user/event';

@Injectable()
export class DeleteEventService {
  constructor(@Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository) {}

  async execute(id: string) {
    const event = await this.eventRepo.findById(id);

    if (!event) {
      throw new DeleteEventErrors.NotFoundError();
    }

    if (event.status.value === EventStatusEnum.IN_PROGRESS) {
      throw new DeleteEventErrors.EventInProgressError();
    }

    await this.eventRepo.delete(id);
  }
}
