import { Module } from '@nestjs/common';

import { CreatePaymentService } from './createPayment.service';

import { PaymentRepository } from '@/module/billing/repositories/implementations/payment.repository';
import { PlanRepository } from '@/module/billing/repositories/implementations/plan.repository';
import { IPaymentRepositorySymbol } from '@/module/billing/repositories/payment.repository.interface';
import { IPlanRepositorySymbol } from '@/module/billing/repositories/plan.repository.interface';

@Module({
  providers: [
    CreatePaymentService,
    {
      provide: IPaymentRepositorySymbol,
      useClass: PaymentRepository,
    },
    {
      provide: IPlanRepositorySymbol,
      useClass: PlanRepository,
    },
  ],
  exports: [CreatePaymentService],
})
export class CreatePaymentModule {}
