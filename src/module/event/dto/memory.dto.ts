import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { FileDTO } from '@/module/shared/dto/file.dto';
import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { ApiUUIDProperty } from '@/shared/infra/docs/swagger/decorators/apiUUIDProperty.decorator';

export class MemoryDTO extends BaseEntityDTO {
  @ApiUUIDProperty()
  eventId: string;

  @ApiUUIDProperty()
  fileId: string | null;

  @ApiProperty()
  identifier?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  hidden?: boolean;

  @ApiHideProperty()
  file?: FileDTO;
}
