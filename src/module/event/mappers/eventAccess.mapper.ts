import { EventAccessModel } from '@prisma/client';

import EventAccess from '../domain/eventAccess/eventAccess';
import EventAccessType from '../domain/eventAccess/eventAccessType';
import EventAccessUrl from '../domain/eventAccess/eventAccessUrl';
import { EventAccessDTO } from '../dto/eventAccess.dto';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { EventAccessTypeEnum } from '@/shared/types/event/event';

export interface EventAccessModelWithRelations extends EventAccessModel {}

class BaseEventAccessMapper extends Mapper<EventAccess, EventAccessModelWithRelations, EventAccessDTO> {
  toDomain(eventAccess: EventAccessModelWithRelations): EventAccess {
    return EventAccess.create(
      {
        eventId: new UniqueEntityID(eventAccess.eventId),
        url: EventAccessUrl.create(eventAccess.url),
        type: EventAccessType.create(eventAccess.type as EventAccessTypeEnum),
        createdAt: eventAccess.createdAt,
        updatedAt: eventAccess.updatedAt,
        deletedAt: eventAccess.deletedAt,
      },
      new UniqueEntityID(eventAccess.id),
    );
  }

  toPersistence(eventAccess: EventAccess): EventAccessModel {
    return {
      id: eventAccess.id.toValue(),
      eventId: eventAccess.eventId.toValue(),
      url: eventAccess.url.value,
      type: eventAccess.type.value,
      createdAt: eventAccess.createdAt,
      updatedAt: eventAccess.updatedAt,
      deletedAt: eventAccess.deletedAt,
    };
  }

  toDTO(eventAccess: EventAccess): EventAccessDTO {
    return {
      id: eventAccess.id.toValue(),
      eventId: eventAccess.eventId.toValue(),
      url: eventAccess.url.value,
      type: eventAccess.type.value,
      createdAt: eventAccess.createdAt,
      updatedAt: eventAccess.updatedAt,
      deletedAt: eventAccess.deletedAt,
    };
  }
}

const EventAccessMapper = new BaseEventAccessMapper();

export default EventAccessMapper;
