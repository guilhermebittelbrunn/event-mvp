import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { isAfter, startOfDay } from 'date-fns';

import Event from '@/module/event/domain/event/event';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { Als } from '@/shared/services/als/als.interface';
import { EventStatusEnum } from '@/shared/types/event/event';

@Injectable()
export class ValidateEventAccess {
  constructor(
    private readonly als: Als,
    @Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository,
  ) {}

  async execute(eventId?: string): Promise<Event | null> {
    if (isEmpty(eventId)) {
      return null;
    }

    const event = await this.eventRepo.findCompleteById(eventId);

    if (!event) {
      return null;
    }

    //* @TODO: validate this step in the future *//
    // if (event.startAt > new Date()) {
    //   return null;
    // }

    /**
     * @note na prática o expiresAt do token já valida isso, porém valido aqui novamente
     * para caso o cadastro do evento tenha sido alterado após o login com o token
     * */
    if (isAfter(startOfDay(new Date()), event.availableUntil)) {
      return null;
    }

    if (![EventStatusEnum.IN_PROGRESS, EventStatusEnum.PUBLISHED].includes(event.status.value)) {
      return null;
    }

    this.als.getStore().event = event;

    return event;
  }
}
