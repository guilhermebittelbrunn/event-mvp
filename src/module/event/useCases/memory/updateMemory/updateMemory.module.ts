import { Module } from '@nestjs/common';

import { UpdateMemoryController } from './updateMemory.controller';
import { UpdateMemoryService } from './updateMemory.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { AddFileModule } from '@/module/shared/domain/services/addFile.module';
import { IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import { FileRepository } from '@/module/shared/repositories/implementations/file.repository';
import { TransactionManagerService } from '@/shared/core/infra/prisma/transactionManager/transactionManager.service';
import { ITransactionManagerSymbol } from '@/shared/core/infra/transactionManager.interface';
import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';

@Module({
  imports: [AddFileModule],
  controllers: [UpdateMemoryController],
  providers: [
    UpdateMemoryService,
    {
      provide: IMemoryRepositorySymbol,
      useClass: MemoryRepository,
    },
    {
      provide: IFileRepositorySymbol,
      useClass: FileRepository,
    },
    {
      provide: IFileStoreServiceSymbol,
      useClass: S3StorageService,
    },
    {
      provide: ITransactionManagerSymbol,
      useClass: TransactionManagerService,
    },
  ],
})
export class UpdateMemoryModule {}
