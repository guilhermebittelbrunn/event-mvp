import { Module } from '@nestjs/common';

import { ReplaceFileService } from './replaceFile.service';

import { IFileRepositorySymbol } from '../../../repositories/file.repository.interface';
import { FileRepository } from '../../../repositories/implementations/file.repository';

import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';

@Module({
  providers: [
    ReplaceFileService,
    {
      provide: IFileRepositorySymbol,
      useClass: FileRepository,
    },
    {
      provide: IFileStoreServiceSymbol,
      useClass: S3StorageService,
    },
  ],
  exports: [ReplaceFileService],
})
export class ReplaceFileModule {}
