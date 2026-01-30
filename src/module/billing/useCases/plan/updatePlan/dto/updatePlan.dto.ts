import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';

import { PlanDTO } from '@/module/billing/dto/plan.dto';

export class UpdatePlanDTO extends PartialType(
  OmitType(PlanDTO, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'type']),
) {
  @ApiHideProperty()
  id: string;
}
