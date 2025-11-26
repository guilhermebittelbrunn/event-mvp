import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UpdateMemoryDTO } from '../../updateMemory/dto/updateMemory.dto';

import { ValidatedArray, ValidatedUUID } from '@/shared/decorators';

class UpdateBulkMemoryMemoryDTO extends UpdateMemoryDTO {
  @ApiProperty()
  @ValidatedUUID('id da memória')
  id: string;
}

export class UpdateBulkMemoryDTO {
  @ValidatedArray('memórias')
  @ValidateNested({ each: true })
  @Type(() => UpdateBulkMemoryMemoryDTO)
  memories: UpdateBulkMemoryMemoryDTO[];
}
