import { Inject, Injectable } from '@nestjs/common';

import CreateEventErrors from './createEvent.error';
import { CreateEventDTO } from './dto/createEvent.dto';

import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent';
import EventConfig from '@/module/event/domain/eventConfig';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { AddFileService } from '@/module/shared/domain/file/services/addFile/addFile.service';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { EventStatusEnum } from '@/shared/types/event/event';

@Injectable()
export class CreateEventService {
  constructor(
    @Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository,
    private readonly addAccessToEvent: AddAccessToEvent,
    private readonly addFileService: AddFileService,
  ) {}

  async execute(dto: CreateEventDTO) {
    const event = await this.buildEvent(dto);

    if (!isEmpty(dto.image)) {
      await this.addFileService.execute({ entityId: event.id.toValue(), file: dto.image });
    }

    return event;
  }

  private async buildEvent(dto: CreateEventDTO) {
    const { slug, status, userId } = dto;

    const eventSlug = EventSlug.create(slug);

    const existingEvent = await this.eventRepo.findBySlug(eventSlug);

    if (existingEvent) {
      throw new CreateEventErrors.SlugAlreadyInUse(eventSlug);
    }

    const eventStatus = EventStatus.create(status ?? EventStatusEnum.DRAFT);

    const event = Event.create({
      ...dto,
      userId: UniqueEntityID.create(userId),
      slug: eventSlug,
      status: eventStatus,
    });

    event.config = EventConfig.create({
      eventId: event.id,
    });

    this.addAccessToEvent.execute({ event });

    return this.eventRepo.save(event);
  }
}
