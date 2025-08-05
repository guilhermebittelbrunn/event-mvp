import { ApiHideProperty, PartialType } from '@nestjs/swagger';

import { CreateEventDTO } from '@/module/event/useCases/event/createEvent/dto/createEvent.dto';

export class UpdateEventDTO extends PartialType(CreateEventDTO) {
  @ApiHideProperty()
  id: string;
}
