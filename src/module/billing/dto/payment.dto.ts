import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { PaymentStatusEnum } from '@/shared/types';

export class PaymentDTO extends BaseEntityDTO {
  @ApiProperty()
  status: PaymentStatusEnum;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  paymentUrl: string;
}
