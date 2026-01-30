import { Module } from '@nestjs/common';

import { CreatePaymentModule } from './createPayment/createPayment.module';

@Module({
  imports: [CreatePaymentModule],
})
export class PaymentModule {}
