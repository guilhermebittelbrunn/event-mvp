import { EventAccessModel, EventConfigModel, EventModel, FileModel } from '@prisma/client';

import EventAccessMapper from './eventAccess.mapper';
import EventConfigMapper from './eventConfig.mapper';

import Event from '../domain/event/event';
import EventSlug from '../domain/event/eventSlug';
import EventStatus from '../domain/event/eventStatus';
import { EventAccesses } from '../domain/eventAccess/eventAccesses';
import { EventDTO } from '../dto/event.dto';

import FileMapper from '@/module/shared/mappers/file.mapper';
import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { EventStatusEnum } from '@/shared/types/user/event';

export interface EventModelWithRelations extends EventModel {
  config?: EventConfigModel;
  accesses?: EventAccessModel[];
  file?: FileModel;
}

class BaseEventMapper extends Mapper<Event, EventModelWithRelations, EventDTO> {
  toDomain(event: EventModelWithRelations): Event {
    return Event.create(
      {
        name: event.name,
        userId: new UniqueEntityID(event.userId),
        slug: EventSlug.create(event.slug),
        status: EventStatus.create(event.status as EventStatusEnum),
        description: event.description,
        startAt: event.startAt,
        endAt: event.endAt,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        deletedAt: event.deletedAt,
        config: EventConfigMapper.toDomainOrUndefined(event.config),
        accesses: EventAccesses.create(event.accesses?.map(EventAccessMapper.toDomain)),
        file: FileMapper.toDomainOrUndefined(event.file),
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
      startAt: event.startAt,
      endAt: event.endAt,
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
      startAt: event.startAt,
      endAt: event.endAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      deletedAt: event.deletedAt,
      config: EventConfigMapper.toDTOOrUndefined(event.config),
      guestAccess: EventAccessMapper.toDTOOrUndefined(event.guestAccess),
      file: FileMapper.toDTOOrUndefined(event.file),
    };
  }
}

const EventMapper = new BaseEventMapper();

export default EventMapper;
