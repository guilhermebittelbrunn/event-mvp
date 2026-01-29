import { IsOptional } from 'class-validator';

import Event from '@/module/event/domain/event/event';

export class CreatePaymentDTO {
  @IsOptional()
  event?: Event;
}
