import { Module } from '@nestjs/common';

import { PaymentWebhookModule } from './payment/payment.module';

@Module({
  imports: [PaymentWebhookModule],
})
export class WebhookApplicationModule {}
