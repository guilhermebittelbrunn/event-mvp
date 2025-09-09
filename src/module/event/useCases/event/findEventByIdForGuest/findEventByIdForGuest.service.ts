import { Inject, Injectable } from '@nestjs/common';

import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

@Injectable()
export class FindEventByIdForGuestService {
  constructor(@Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository) {}

  async execute(id: string) {
    const event = await this.eventRepo.findById(id);

    if (!event) {
      throw new GenericErrors.NotFound(`Evento não encontrado`);
    }

    return event;
  }
}
