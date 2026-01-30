import { Module } from '@nestjs/common';

import { CreateEventController } from './createEvent.controller';
import { CreateEventService } from './createEvent.service';

import { CreatePaymentModule } from '@/module/billing/useCases/payment/createPayment/createPayment.module';
import { PaymentModule } from '@/module/billing/useCases/payment/payment.module';
import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent.service';
import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';
import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { AddFileModule } from '@/module/shared/domain/file/services/addFile/addFile.module';
import { IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import { FileRepository } from '@/module/shared/repositories/implementations/file.repository';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';

@Module({
  imports: [AddFileModule, EventRepositoryFactory, CreatePaymentModule, PaymentModule],
  controllers: [CreateEventController],
  providers: [
    CreateEventService,
    AddAccessToEvent,
    {
      provide: IFileRepositorySymbol,
      useClass: FileRepository,
    },
    {
      provide: IMemoryRepositorySymbol,
      useClass: MemoryRepository,
    },
    {
      provide: ITransactionManagerSymbol,
      useClass: TransactionManagerService,
    },
  ],
})
export class CreateEventModule {}
