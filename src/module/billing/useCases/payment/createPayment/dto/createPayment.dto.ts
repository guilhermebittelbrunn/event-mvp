import { IsOptional } from 'class-validator';

import Plan from '@/module/billing/domain/plan/plan';
import Event from '@/module/event/domain/event/event';

export class CreatePaymentDTO {
  plan: Plan;

  @IsOptional()
  event?: Event;
}
