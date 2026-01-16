import { Module } from '@nestjs/common';

import { CreatePaymentService } from './createPayment.service';

import { PaymentRepository } from '@/module/billing/repositories/implementations/payment.repository';
import { IPaymentRepositorySymbol } from '@/module/billing/repositories/payment.repository.interface';

@Module({
  providers: [
    CreatePaymentService,
    {
      provide: IPaymentRepositorySymbol,
      useClass: PaymentRepository,
    },
  ],
  exports: [CreatePaymentService],
})
export class CreatePaymentModule {}
