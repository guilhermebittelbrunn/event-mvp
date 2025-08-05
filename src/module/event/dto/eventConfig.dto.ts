import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { ApiUUIDProperty } from '@/shared/infra/docs/swagger/decorators/apiUUIDProperty.decorator';

export class EventConfigDTO extends BaseEntityDTO {
  @ApiUUIDProperty()
  eventId: string;

  @ApiProperty()
  primaryColor: string;

  @ApiProperty()
  secondaryColor: string;

  @ApiProperty()
  primaryContrast: string;

  @ApiProperty()
  secondaryContrast: string;

  @ApiProperty()
  backgroundColor: string;

  @ApiProperty()
  backgroundContrast: string;

  @ApiProperty()
  textColorPrimary: string;

  @ApiProperty()
  textColorSecondary: string;

  @ApiProperty()
  welcomeMessage: string;
}
