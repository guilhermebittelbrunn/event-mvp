import { ValidatedNumber } from '@/shared/decorators';

export class CreatePaymentDTO {
  @ValidatedNumber('valor')
  amount: number;
}
