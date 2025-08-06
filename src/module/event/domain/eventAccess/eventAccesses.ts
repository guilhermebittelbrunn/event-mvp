import EventAccess from './eventAccess';

import Aggregate from '@/shared/core/domain/Aggregate';
import { EventAccessTypeEnum } from '@/shared/types/user/event';

export class EventAccesses extends Aggregate<EventAccess> {
  private constructor(initialItems?: Array<EventAccess>) {
    super(initialItems);
  }

  compareItems(a: EventAccess, b: EventAccess): boolean {
    return a.equals(b);
  }

  add(...items: Array<EventAccess>): void {
    for (const item of items) {
      const guestAccess = this.guestAccess;
      const ownerAccess = this.ownerAccess;

      if (guestAccess && item.type.value === EventAccessTypeEnum.GUEST) {
        this.remove(guestAccess);
      }

      if (ownerAccess && item.type.value === EventAccessTypeEnum.OWNER) {
        this.remove(ownerAccess);
      }

      super.add(item);
    }
  }

  get guestAccess(): EventAccess | undefined {
    return this.items.find(({ type }) => type.value === EventAccessTypeEnum.GUEST);
  }

  get ownerAccess(): EventAccess | undefined {
    return this.items.find(({ type }) => type.value === EventAccessTypeEnum.OWNER);
  }

  public static create(initialItems?: Array<EventAccess>): EventAccesses {
    return new EventAccesses(initialItems);
  }
}
