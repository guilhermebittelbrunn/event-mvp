import { Inject, Injectable } from '@nestjs/common';
import * as archiver from 'archiver';

import { Readable } from 'stream';

import DownloadMemoriesErrors from './downloadMemories.error';
import { DownloadMemoriesDTO } from './dto/downloadMemories.dto';

import Memory from '@/module/event/domain/memory/memory';
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

const MAX_MEMORY_IDS_TO_DOWNLOAD = 10;

const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
};

function getContentTypeFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return (ext && EXTENSION_TO_MIME[ext]) || 'application/octet-stream';
}

export interface DownloadMemoriesResult {
  stream: Readable;
  contentType: string;
  filename: string;
}

@Injectable()
export class DownloadMemoriesService {
  constructor(
    @Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository,
    @Inject(IFileStoreServiceSymbol) private readonly fileStoreService: IFileStoreService,
    private readonly registerLogService: RegisterLogService,
  ) {}

  async execute(dto: DownloadMemoriesDTO): Promise<DownloadMemoriesResult> {
    const { memoryIds } = dto;

    if (memoryIds.length > MAX_MEMORY_IDS_TO_DOWNLOAD) {
      throw new DownloadMemoriesErrors.MaxMemoryIdsToDownloadExceeded(MAX_MEMORY_IDS_TO_DOWNLOAD);
    }

    const memories = await this.memoryRepo.findAllForDownload(memoryIds);

    if (!filledArray(memories)) {
      throw new DownloadMemoriesErrors.MemoriesNotFound();
    }

    if (memories.length === 1) {
      return this.handleUniqueMemory(memories[0]);
    }

    return this.handleMultipleMemories(memories, dto);
  }

  async handleUniqueMemory(memory: Memory): Promise<DownloadMemoriesResult> {
    if (!memory.file) {
      throw new DownloadMemoriesErrors.NoFilesToDownload();
    }

    const fileStream = await this.fileStoreService.getFile(memory.file.path);

    if (!fileStream) {
      throw new DownloadMemoriesErrors.NoFilesToDownload();
    }

    return {
      stream: fileStream,
      contentType: getContentTypeFromFilename(memory.file.name),
      filename: memory.file.name,
    };
  }

  async handleMultipleMemories(memories: Memory[], dto: DownloadMemoriesDTO): Promise<DownloadMemoriesResult> {
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

    return {
      stream: archive,
      contentType: 'application/zip',
      filename: 'memories.zip',
    };
  }
}
