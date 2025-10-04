import { Injectable } from '@nestjs/common';

import { AddAccessToEventDTO } from './addAccessToEvent.dto';

import Event from '../../../event/event';
import EventAccess from '../../eventAccess';
import EventAccessType from '../../eventAccessType';
import EventAccessUrl from '../../eventAccessUrl';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { EventAccessTypeEnum } from '@/shared/types/event/event';

@Injectable()
export class AddAccessToEvent {
  execute({ event, type }: AddAccessToEventDTO): void {
    if (isEmpty(event?.slug?.value)) return;

    const eventType = EventAccessType.create(type ?? EventAccessTypeEnum.GUEST);
    const access = event.accesses.find(eventType.value);

    if (access) {
      this.handleExistingAccess(event, access);
    } else {
      this.handleNewAccess(event, eventType);
    }
  }

  private handleExistingAccess(event: Event, access: EventAccess): void {
    const updatedAccess = EventAccess.create(
      {
        eventId: access.eventId,
        type: access.type,
        url: EventAccessUrl.create(this.generateAccessUrl(event, access.id)),
      },
      access.id,
    );

    event?.accesses?.update(updatedAccess);
  }

  private handleNewAccess(event: Event, type: EventAccessType): void {
    const accessId = UniqueEntityID.create();
    const url = EventAccessUrl.create(this.generateAccessUrl(event, accessId));

    const eventAccess = EventAccess.create(
      {
        eventId: event?.id,
        type,
        url,
      },
      accessId,
    );

    event?.accesses?.add(eventAccess);
  }

  private generateAccessUrl(event: Event, accessId: UniqueEntityID): string {
    return `/${event.slug.value}?t=${accessId.toValue()}`;
  }
}
