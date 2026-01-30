import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

export class PlanDTO extends BaseEntityDTO {
  @ApiProperty()
  type: PlanTypeEnum;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  enabled: boolean;
}
