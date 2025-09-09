import { ApiProperty } from '@nestjs/swagger';

import { EventDTO } from '@/module/event/dto/event.dto';
import { EventAccessDTO } from '@/module/event/dto/eventAccess.dto';
import { EventConfigDTO } from '@/module/event/dto/eventConfig.dto';
import { FileDTO } from '@/module/shared/dto/file.dto';

export class FileEventByIdResponseDTO extends EventDTO {
  @ApiProperty()
  config?: EventConfigDTO;

  @ApiProperty()
  guestAccess?: EventAccessDTO;

  @ApiProperty()
  file?: FileDTO;
}
