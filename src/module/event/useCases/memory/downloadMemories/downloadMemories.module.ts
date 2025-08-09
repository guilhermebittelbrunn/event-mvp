import { Module } from '@nestjs/common';

import { DownloadMemoriesController } from './downloadMemories.controller';
import { DownloadMemoriesService } from './downloadMemories.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';

@Module({
  controllers: [DownloadMemoriesController],
  providers: [
    DownloadMemoriesService,
    {
      provide: IMemoryRepositorySymbol,
      useClass: MemoryRepository,
    },
    {
      provide: IFileStoreServiceSymbol,
      useClass: S3StorageService,
    },
  ],
  exports: [DownloadMemoriesService],
})
export class DownloadMemoriesModule {}
