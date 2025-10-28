import File from '../../file';

import Event from '@/module/event/domain/event/event';

export class BuildPathDTO {
  file: File;
  event?: Event;
  showDatePrefix?: boolean;
}
