import { Inject, Injectable } from '@nestjs/common';

import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

@Injectable()
export class FindEventBySlugService {
  constructor(@Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository) {}

  async execute(slug: string) {
    const event = await this.eventRepo.findBySlug(slug);

    if (!event) {
      throw new GenericErrors.NotFound(`Evento não encontrado`);
    }

    return event;
  }
}
