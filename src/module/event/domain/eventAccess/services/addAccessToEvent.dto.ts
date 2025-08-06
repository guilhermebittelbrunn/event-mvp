import Event from '../../event/event';

import { EventAccessTypeEnum } from '@/shared/types/user/event';

export interface AddAccessToEventDTO {
  event: Event;
  type?: EventAccessTypeEnum;
}
