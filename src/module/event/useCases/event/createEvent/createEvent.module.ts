import { Module } from '@nestjs/common';

import { CreateEventController } from './createEvent.controller';
import { CreateEventService } from './createEvent.service';

import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent';
import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';
import { AddFileModule } from '@/module/shared/domain/file/services/addFile/addFile.module';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';

@Module({
  imports: [AddFileModule],
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
    AddAccessToEvent,
  ],
})
export class CreateEventModule {}
