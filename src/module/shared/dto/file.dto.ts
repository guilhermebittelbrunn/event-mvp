import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { ApiUUIDProperty } from '@/shared/infra/docs/swagger/decorators/apiUUIDProperty.decorator';

export class FileDTO extends BaseEntityDTO {
  @ApiUUIDProperty()
  entityId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;
}
