import { Inject, Injectable } from '@nestjs/common';

import { UpdateEventDTO } from './dto/updateEvent.dto';
import UpdateEventErrors from './updateEvent.error';

import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { ReplaceFileService } from '@/module/shared/domain/file/services/replaceFile/replaceFile.service';
import { coalesce, isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { EventStatusEnum } from '@/shared/types/event/event';

@Injectable()
export class UpdateEventService {
  constructor(
    @Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository,
    private readonly replaceFileService: ReplaceFileService,
    private readonly addAccessToEvent: AddAccessToEvent,
  ) {}

  async execute(dto: UpdateEventDTO) {
    const currentEvent = await this.validateAndFetchData(dto);

    const updatedEvent = await this.buildEvent(dto, currentEvent);

    if (!isEmpty(dto.image)) {
      const oldFileId = currentEvent.file?.id.toValue();

      await this.replaceFileService.execute({ entityId: dto.id, oldFileId, file: dto.image });
    }

    return updatedEvent.id.toValue();
  }

  private async validateAndFetchData({ id }: UpdateEventDTO) {
    const currentEvent = await this.eventRepo.findCompleteById(id);

    if (!currentEvent) {
      throw new UpdateEventErrors.NotFoundError();
    }

    if ([EventStatusEnum.IN_PROGRESS, EventStatusEnum.COMPLETED].includes(currentEvent.status.value)) {
      throw new UpdateEventErrors.InvalidParam(currentEvent.status);
    }

    return currentEvent;
  }

  private async buildEvent(dto: UpdateEventDTO, currentEvent: Event) {
    let eventStatus: EventStatus | undefined;
    let eventSlug: EventSlug | undefined;

    if (!isEmpty(dto.status)) {
      eventStatus = EventStatus.create(dto.status);
    }

    if (!isEmpty(dto.slug)) {
      eventSlug = EventSlug.create(dto.slug);

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
        startAt: coalesce(dto.startAt, currentEvent.startAt),
        endAt: coalesce(dto.endAt, currentEvent.endAt),
        config: currentEvent.config,
        accesses: currentEvent.accesses,
      },
      currentEvent.id,
    );

    this.addAccessToEvent.execute({ event });

    await this.eventRepo.update(event);

    return event;
  }
}
