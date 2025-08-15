import { Inject, Injectable } from '@nestjs/common';

import DeleteBulkMemoryErrors from './deleteBulkMemory.error';
import { DeleteBulkMemoryDTO } from './dto/deleteBulkMemory.dto';

import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import { IFileRepository, IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import { filledArray } from '@/shared/core/utils/undefinedHelpers';
import {
  IFileStoreService,
  IFileStoreServiceSymbol,
} from '@/shared/services/fileStore/fileStore.service.interface';

const MAX_MEMORY_IDS_TO_DELETE = 30;

@Injectable()
export class DeleteBulkMemoryService {
  constructor(
    @Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository,
    @Inject(IFileRepositorySymbol) private readonly fileRepo: IFileRepository,
    @Inject(IFileStoreServiceSymbol) private readonly fileStoreService: IFileStoreService,
  ) {}

  async execute({ memoryIds }: DeleteBulkMemoryDTO) {
    if (memoryIds.length > MAX_MEMORY_IDS_TO_DELETE) {
      throw new DeleteBulkMemoryErrors.MaxMemoryIdsToDeleteExceeded(MAX_MEMORY_IDS_TO_DELETE);
    }

    const memories = await this.memoryRepo.findAllByIds(memoryIds);

    if (memories.length !== memoryIds.length) {
      throw new DeleteBulkMemoryErrors.MemoriesNotFound();
    }

    const fileIds = memories.map(({ fileId }) => fileId);

    if (filledArray(fileIds)) {
      const paths = memories.map(({ file }) => file?.path);

      await Promise.all([
        this.fileRepo.deleteBulk(fileIds),
        ...(filledArray(paths) && [this.fileStoreService.deleteBulk(paths)]),
      ]);
    }

    const allDeleted = await this.memoryRepo.deleteBulk(memoryIds);

    if (!allDeleted) {
      throw new DeleteBulkMemoryErrors.MemoriesNotDeleted();
    }
  }
}
