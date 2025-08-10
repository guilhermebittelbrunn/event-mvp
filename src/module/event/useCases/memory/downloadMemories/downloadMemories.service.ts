import { Inject, Injectable } from '@nestjs/common';
import * as archiver from 'archiver';

import DownloadMemoriesErrors from './downloadMemories.error';
import { DownloadMemoriesDTO } from './dto/downloadMemories.dto';

import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import { RegisterLogService } from '@/module/shared/domain/log/service/registerLog/registerLog.service';
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
    private readonly registerLogService: RegisterLogService,
  ) {}

  async execute(dto: DownloadMemoriesDTO): Promise<archiver.Archiver> {
    const { memoryIds } = dto;

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
        const customMessage = `Error downloading file for memory ${memory.id.toValue()}:`;
        await this.registerLogService.execute({ error, payload: { ...dto }, customMessage });
      }
    }

    if (filesAdded === 0) {
      throw new DownloadMemoriesErrors.NoFilesToDownload();
    }

    archive.finalize();

    return archive;
  }
}
