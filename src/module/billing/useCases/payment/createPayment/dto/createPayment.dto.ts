import { ValidatedEnum } from '@/shared/decorators';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

export class CreatePaymentDTO {
  @ValidatedEnum('tipo de plano', PlanTypeEnum)
  planType: PlanTypeEnum;
}
