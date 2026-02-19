import { Inject, Injectable } from '@nestjs/common';
import { differenceInDays } from 'date-fns';

import { UpdateEventDTO } from './dto/updateEvent.dto';
import UpdateEventErrors from './updateEvent.error';

import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent.service';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { ReplaceFileService } from '@/module/shared/domain/file/services/replaceFile/replaceFile.service';
import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { coalesce } from '@/shared/core/utils/undefinedHelpers';
import { MAX_EVENT_DAYS_RANGE } from '@/shared/utils';

@Injectable()
export class UpdateEventService {
  constructor(
    @Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository,
    @Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository,
    private readonly replaceFileService: ReplaceFileService,
    private readonly addAccessToEvent: AddAccessToEvent,
  ) {}

  async execute(dto: UpdateEventDTO) {
    const currentEvent = await this.eventRepo.findCompleteById(dto.id);

    if (!currentEvent) {
      throw new UpdateEventErrors.NotFoundError();
    }

    if (!dto.isAdmin) {
      dto.userId = undefined;
    }

    if (dto.userId) {
      const user = await this.userRepo.findById(dto.userId);

      if (!user) {
        throw new UpdateEventErrors.UserNotFound();
      }
    }

    const event = await this.buildEvent(dto, currentEvent);

    return this.eventRepo.update(event);
  }

  private async buildEvent(dto: UpdateEventDTO, currentEvent: Event) {
    let eventStatus: EventStatus | undefined;
    let eventSlug: EventSlug | undefined;

    if (dto.status && dto.isAdmin) {
      eventStatus = EventStatus.create(dto.status);
    }

    if (!dto.isAdmin && dto.startAt && dto.endAt) {
      const daysRange = differenceInDays(new Date(dto.endAt), new Date(dto.startAt));

      if (daysRange > MAX_EVENT_DAYS_RANGE) {
        throw new UpdateEventErrors.InvalidEventDaysRange(MAX_EVENT_DAYS_RANGE);
      }
    }

    if (dto.slug) {
      eventSlug = EventSlug.create(dto.slug);

      const existingEvent = await this.eventRepo.findBySlug(eventSlug);

      if (existingEvent && !existingEvent.id.equals(currentEvent.id)) {
        throw new UpdateEventErrors.SlugAlreadyInUse(eventSlug);
      }
    }

    const event = Event.create(
      {
        userId: coalesce(UniqueEntityID.createOrUndefined(dto.userId), currentEvent.userId),
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

    if (dto.image) {
      const oldFileId = currentEvent.file?.id.toValue();

      const { id } = await this.replaceFileService.execute({ oldFileId, file: dto.image });

      event.fileId = id;
    }

    return event;
  }
}
