import { Inject, Injectable } from '@nestjs/common';

import CreateEventErrors from './createEvent.error';
import { CreateEventDTO } from './dto/createEvent.dto';

import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { EventStatusEnum } from '@/shared/types/user/event';

@Injectable()
export class CreateEventService {
  constructor(@Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository) {}

  async execute(dto: CreateEventDTO) {
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

    return this.eventRepo.create(event);
  }
}
