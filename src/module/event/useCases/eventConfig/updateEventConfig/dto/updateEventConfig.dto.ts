import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';

import { EventConfigDTO } from '@/module/event/dto/eventConfig.dto';

export class UpdateEventConfigDTO extends PartialType(OmitType(EventConfigDTO, ['eventId'])) {
  @ApiHideProperty()
  id: string;

  @ApiHideProperty()
  eventId: string;
}
