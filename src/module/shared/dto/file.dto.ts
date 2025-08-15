import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';

export class FileDTO extends BaseEntityDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;
}
