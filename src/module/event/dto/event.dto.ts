import { ApiProperty } from '@nestjs/swagger';

import { EventAccessDTO } from './eventAccess.dto';
import { EventConfigDTO } from './eventConfig.dto';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { ApiUUIDProperty } from '@/shared/infra/docs/swagger/decorators/apiUUIDProperty.decorator';
import { EventStatusEnum } from '@/shared/types/user/event';

export class EventDTO extends BaseEntityDTO {
  @ApiUUIDProperty()
  userId: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  status: EventStatusEnum;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  @ApiProperty({ required: false })
  config?: EventConfigDTO;

  @ApiProperty({ required: false })
  guestAccess?: EventAccessDTO;
}
