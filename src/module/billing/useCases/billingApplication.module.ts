import { Module } from '@nestjs/common';

import { PaymentModule } from './payment/payment.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [PaymentModule, PlanModule],
})
export class BillingApplicationModule {}
