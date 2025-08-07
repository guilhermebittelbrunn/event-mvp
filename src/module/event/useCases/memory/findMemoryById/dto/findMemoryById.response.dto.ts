import { ApiProperty } from '@nestjs/swagger';

import { MemoryDTO } from '@/module/event/dto/memory.dto';
import { FileDTO } from '@/module/shared/dto/file.dto';

export class FindMemoryByIdDTO extends MemoryDTO {
  @ApiProperty()
  file?: FileDTO;
}
