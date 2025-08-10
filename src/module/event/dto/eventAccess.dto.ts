import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { ApiUUIDProperty } from '@/shared/infra/docs/swagger/decorators/apiUUIDProperty.decorator';
import { EventAccessTypeEnum } from '@/shared/types/event/event';

export class EventAccessDTO extends BaseEntityDTO {
  @ApiUUIDProperty()
  eventId: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: EventAccessTypeEnum;
}
