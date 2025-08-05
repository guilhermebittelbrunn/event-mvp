import { EventModel } from '@prisma/client';

import Event from '../domain/event/event';
import EventSlug from '../domain/event/eventSlug';
import EventStatus from '../domain/event/eventStatus';
import { EventDTO } from '../dto/event.dto';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { EventStatusEnum } from '@/shared/types/user/event';

export interface EventModelWithRelations extends EventModel {}

class BaseEventMapper extends Mapper<Event, EventModelWithRelations, EventDTO> {
  toDomain(event: EventModelWithRelations): Event {
    return Event.create(
      {
        name: event.name,
        userId: new UniqueEntityID(event.userId),
        slug: EventSlug.create(event.slug),
        status: EventStatus.create(event.status as EventStatusEnum),
        description: event.description,
        start_at: event.start_at,
        end_at: event.end_at,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        deletedAt: event.deletedAt,
      },
      new UniqueEntityID(event.id),
    );
  }

  toPersistence(event: Event): EventModel {
    return {
      id: event.id.toValue(),
      userId: event.userId.toValue(),
      name: event.name,
      slug: event.slug.value,
      status: event.status.value,
      description: event.description,
      start_at: event.start_at,
      end_at: event.end_at,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      deletedAt: event.deletedAt,
    };
  }

  toDTO(event: Event): EventDTO {
    return {
      id: event.id.toValue(),
      userId: event.userId.toValue(),
      name: event.name,
      slug: event.slug.value,
      status: event.status.value,
      description: event.description,
      start_at: event.start_at,
      end_at: event.end_at,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      deletedAt: event.deletedAt,
    };
  }
}

const EventMapper = new BaseEventMapper();

export default EventMapper;
