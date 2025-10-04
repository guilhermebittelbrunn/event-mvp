import { Module } from '@nestjs/common';

import { UpdateEventController } from './updateEvent.controller';
import { UpdateEventService } from './updateEvent.service';

import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent.service';
import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';
import { ReplaceFileModule } from '@/module/shared/domain/file/services/replaceFile/replaceFile.module';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';

@Module({
  imports: [ReplaceFileModule, EventRepositoryFactory],
  controllers: [UpdateEventController],
  providers: [
    UpdateEventService,
    {
      provide: ITransactionManagerSymbol,
      useClass: TransactionManagerService,
    },
    AddAccessToEvent,
  ],
})
export class UpdateEventModule {}
