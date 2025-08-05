import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { EventStatusEnum } from '@/shared/types/user/event';

export class EventDTO extends BaseEntityDTO {
  @ApiProperty()
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
  start_at: Date;

  @ApiProperty()
  end_at: Date;
}
