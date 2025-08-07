import { Module } from '@nestjs/common';

import { DeleteBulkMemoryController } from './deleteBulkMemory.controller';
import { DeleteBulkMemoryService } from './deleteBulkMemory.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import { FileRepository } from '@/module/shared/repositories/implementations/file.repository';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';
import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';

@Module({
  imports: [],
  controllers: [DeleteBulkMemoryController],
  providers: [
    DeleteBulkMemoryService,
    {
      provide: IMemoryRepositorySymbol,
      useClass: MemoryRepository,
    },
    {
      provide: ITransactionManagerSymbol,
      useClass: TransactionManagerService,
    },
    {
      provide: IFileRepositorySymbol,
      useClass: FileRepository,
    },
    {
      provide: IFileStoreServiceSymbol,
      useClass: S3StorageService,
    },
  ],
})
export class DeleteBulkMemoryModule {}
