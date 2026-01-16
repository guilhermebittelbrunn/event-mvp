import { Module } from '@nestjs/common';

import { ProcessPaymentModule } from './processPayment/processPayment.module';

@Module({
  imports: [ProcessPaymentModule],
})
export class PaymentWebhookModule {}
