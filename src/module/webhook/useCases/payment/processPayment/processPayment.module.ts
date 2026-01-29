import { Module } from '@nestjs/common';

import { ProcessPaymentController } from './processPayment.controller';
import { ProcessPaymentService } from './processPayment.service';

import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';

@Module({
  imports: [EventRepositoryFactory],
  controllers: [ProcessPaymentController],
  providers: [ProcessPaymentService],
})
export class ProcessPaymentModule {}
