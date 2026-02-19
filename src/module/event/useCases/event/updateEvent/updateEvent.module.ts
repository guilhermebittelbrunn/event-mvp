import { Module } from '@nestjs/common';

import { UpdateEventController } from './updateEvent.controller';
import { UpdateEventService } from './updateEvent.service';

import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent.service';
import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';
import { ReplaceFileModule } from '@/module/shared/domain/file/services/replaceFile/replaceFile.module';
import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
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
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
    AddAccessToEvent,
  ],
})
export class UpdateEventModule {}
