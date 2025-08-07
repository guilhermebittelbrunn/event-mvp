import { ApiHideProperty, PartialType } from '@nestjs/swagger';

import { CreateMemoryDTO } from '../../createMemory/dto/createMemory.dto';

export class UpdateMemoryDTO extends PartialType(CreateMemoryDTO) {
  @ApiHideProperty()
  id: string;
}
