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

    const memories = await this.memoryRepo.findByIds(memoryIds);

    if (memories.length !== memoryIds.length) {
      throw new DeleteBulkMemoryErrors.MemoriesNotFound();
    }

    const memoryRawIds = memories.map(({ id }) => id);

    const files = await this.fileRepo.findAllByEntityId(memoryRawIds);

    if (filledArray(files)) {
      await Promise.all([
        this.fileStoreService.deleteBulk(files.map(({ path }) => path)),
        this.fileRepo.deleteBulk(files.map(({ id }) => id)),
      ]);
    }

    const allDeleted = await this.memoryRepo.deleteBulk(memoryRawIds);

    if (!allDeleted) {
      throw new DeleteBulkMemoryErrors.MemoriesNotDeleted();
    }
  }
}
