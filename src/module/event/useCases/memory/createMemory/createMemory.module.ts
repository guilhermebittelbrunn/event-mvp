import { Module } from '@nestjs/common';

import { CreateMemoryController } from './createMemory.controller';
import { CreateMemoryService } from './createMemory.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { AddFileModule } from '@/module/shared/domain/services/addFile/addFile.module';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';

@Module({
  imports: [AddFileModule],
  controllers: [CreateMemoryController],
  providers: [
    CreateMemoryService,
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
export class CreateMemoryModule {}
