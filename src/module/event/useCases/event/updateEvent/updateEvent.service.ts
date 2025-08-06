import { Inject, Injectable } from '@nestjs/common';

import { UpdateEventDTO } from './dto/updateEvent.dto';
import UpdateEventErrors from './updateEvent.error';

import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { coalesce, isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { EventStatusEnum } from '@/shared/types/user/event';

@Injectable()
export class UpdateEventService {
  constructor(
    @Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository,
    private readonly addAccessToEvent: AddAccessToEvent,
  ) {}

  async execute(dto: UpdateEventDTO) {
    const { status, slug } = dto;

    const currentEvent = await this.eventRepo.findCompleteById(dto.id);

    if (!currentEvent) {
      throw new UpdateEventErrors.NotFoundError();
    }

    if ([EventStatusEnum.IN_PROGRESS, EventStatusEnum.COMPLETED].includes(currentEvent.status.value)) {
      throw new UpdateEventErrors.InvalidParam(currentEvent.status);
    }

    let eventStatus: EventStatus | undefined;
    let eventSlug: EventSlug | undefined;

    if (!isEmpty(status)) {
      eventStatus = EventStatus.create(status);
    }

    if (!isEmpty(slug)) {
      eventSlug = EventSlug.create(slug);

      const existingEvent = await this.eventRepo.findBySlug(eventSlug);

      if (existingEvent) {
        throw new UpdateEventErrors.SlugAlreadyInUse(eventSlug);
      }
    }

    const event = Event.create(
      {
        userId: currentEvent.userId,
        name: coalesce(dto.name, currentEvent.name),
        description: coalesce(dto.description, currentEvent.description),
        status: coalesce(eventStatus, currentEvent.status),
        slug: coalesce(eventSlug, currentEvent.slug),
        start_at: coalesce(dto.start_at, currentEvent.start_at),
        end_at: coalesce(dto.end_at, currentEvent.end_at),
        config: currentEvent.config,
        accesses: currentEvent.accesses,
      },
      currentEvent.id,
    );

    this.addAccessToEvent.execute({ event });

    return this.eventRepo.update(event);
  }
}
