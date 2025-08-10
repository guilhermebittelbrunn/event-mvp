import { Module } from '@nestjs/common';

import { UpdateMemoryController } from './updateMemory.controller';
import { UpdateMemoryService } from './updateMemory.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { ReplaceFileModule } from '@/module/shared/domain/file/services/replaceFile/replaceFile.module';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';

@Module({
  imports: [ReplaceFileModule],
  controllers: [UpdateMemoryController],
  providers: [
    UpdateMemoryService,
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
export class UpdateMemoryModule {}
