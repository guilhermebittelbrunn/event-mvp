import { AddAccessToEventDTO } from './addAccessToEvent.dto';

import Event from '../../event/event';
import EventAccess from '../eventAccess';
import EventAccessType from '../eventAccessType';
import EventAccessUrl from '../eventAccessUrl';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { EventAccessTypeEnum } from '@/shared/types/user/event';

export class AddAccessToEvent {
  execute({ event, type }: AddAccessToEventDTO): EventAccess | undefined {
    if (isEmpty(event.slug.value)) return;

    const accessId = UniqueEntityID.create();

    const eventType = EventAccessType.create(type ?? EventAccessTypeEnum.GUEST);
    const eventUrl = EventAccessUrl.create(this.generateAccessUrl(event, accessId));

    const eventAccess = EventAccess.create(
      {
        eventId: event?.id,
        type: eventType,
        url: eventUrl,
      },
      accessId,
    );

    event?.accesses?.add(eventAccess);

    return eventAccess;
  }

  private generateAccessUrl(event: Event, accessId: UniqueEntityID): string {
    return `/${event.slug.value}?t=${accessId.toValue()}`;
  }
}
