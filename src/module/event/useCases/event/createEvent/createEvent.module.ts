import { Module } from '@nestjs/common';

import { CreateEventController } from './createEvent.controller';
import { CreateEventService } from './createEvent.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/TransactionManager.interface';

@Module({
  controllers: [CreateEventController],
  providers: [
    CreateEventService,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
    {
      provide: ITransactionManagerSymbol,
      useClass: TransactionManagerService,
    },
  ],
})
export class CreateEventModule {}
