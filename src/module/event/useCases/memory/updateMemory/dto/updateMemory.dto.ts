import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateMemoryDTO } from '../../createMemory/dto/createMemory.dto';

import { ValidatedBoolean } from '@/shared/decorators';

export class UpdateMemoryDTO extends PartialType(CreateMemoryDTO) {
  @ApiHideProperty()
  id: string;

  @IsOptional()
  @ValidatedBoolean('ocultar')
  hidden?: boolean;
}
