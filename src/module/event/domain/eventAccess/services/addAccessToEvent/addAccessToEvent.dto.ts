import Event from '../../../event/event';

import { EventAccessTypeEnum } from '@/shared/types/event/event';

export interface AddAccessToEventDTO {
  event: Event;
  type?: EventAccessTypeEnum;
}
