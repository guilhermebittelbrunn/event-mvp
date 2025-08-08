import { Module } from '@nestjs/common';

import { UpdateEventController } from './updateEvent.controller';
import { UpdateEventService } from './updateEvent.service';

import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent';
import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';
import { ReplaceFileModule } from '@/module/shared/domain/services/replaceFile/replaceFile.module';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';

@Module({
  imports: [ReplaceFileModule],
  controllers: [UpdateEventController],
  providers: [
    UpdateEventService,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
    {
      provide: ITransactionManagerSymbol,
      useClass: TransactionManagerService,
    },
    AddAccessToEvent,
  ],
})
export class UpdateEventModule {}
