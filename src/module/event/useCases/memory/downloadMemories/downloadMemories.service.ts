import { Inject, Injectable } from '@nestjs/common';
import * as archiver from 'archiver';

import DownloadMemoriesErrors from './downloadMemories.error';
import { DownloadMemoriesDTO } from './dto/downloadMemories.dto';

import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import { filledArray } from '@/shared/core/utils/undefinedHelpers';
import {
  IFileStoreService,
  IFileStoreServiceSymbol,
} from '@/shared/services/fileStore/fileStore.service.interface';

const MAX_MEMORY_IDS_TO_DOWNLOAD = 30;

@Injectable()
export class DownloadMemoriesService {
  constructor(
    @Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository,
    @Inject(IFileStoreServiceSymbol) private readonly fileStoreService: IFileStoreService,
  ) {}

  async execute({ memoryIds }: DownloadMemoriesDTO): Promise<archiver.Archiver> {
    if (memoryIds.length > MAX_MEMORY_IDS_TO_DOWNLOAD) {
      throw new DownloadMemoriesErrors.MaxMemoryIdsToDownloadExceeded(MAX_MEMORY_IDS_TO_DOWNLOAD);
    }

    const memories = await this.memoryRepo.findAllForDownload(memoryIds);

    if (!filledArray(memories)) {
      throw new DownloadMemoriesErrors.MemoriesNotFound();
    }

    const archive = archiver('zip', { zlib: { level: 9 } });

    let filesAdded = 0;

    for (const memory of memories) {
      if (!memory.file) {
        continue;
      }

      try {
        const fileStream = await this.fileStoreService.getFile(memory.file.path);

        if (!fileStream) {
          continue;
        }

        const fileName = `${memory.id.toValue()}_${memory.file.name}`;

        archive.append(fileStream, { name: fileName });
        filesAdded++;
      } catch (error) {
        // Log error but continue with other files
        console.error(`Error downloading file for memory ${memory.id.toValue()}:`, error);
      }
    }

    if (filesAdded === 0) {
      throw new DownloadMemoriesErrors.NoFilesToDownload();
    }

    archive.finalize();

    return archive;
  }
}
