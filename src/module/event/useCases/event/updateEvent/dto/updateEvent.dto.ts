import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateEventDTO } from '@/module/event/useCases/event/createEvent/dto/createEvent.dto';
import { ValidatedEnum } from '@/shared/decorators';
import { EventStatusEnum } from '@/shared/types';

export class UpdateEventDTO extends PartialType(CreateEventDTO) {
  @ApiHideProperty()
  id: string;

  @IsOptional()
  @ValidatedEnum('status', EventStatusEnum)
  status?: EventStatusEnum;
}
