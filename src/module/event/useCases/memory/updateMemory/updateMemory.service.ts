import { Inject, Injectable } from '@nestjs/common';

import { UpdateMemoryDTO } from './dto/updateMemory.dto';

import Memory from '@/module/event/domain/memory/memory';
import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import { AddFileService } from '@/module/shared/domain/services/addFile.service';
import { IFileRepository, IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { coalesce, isEmpty } from '@/shared/core/utils/undefinedHelpers';
import {
  IFileStoreService,
  IFileStoreServiceSymbol,
} from '@/shared/services/fileStore/fileStore.service.interface';

@Injectable()
export class UpdateMemoryService {
  constructor(
    @Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository,
    @Inject(IFileRepositorySymbol) private readonly fileRepo: IFileRepository,
    @Inject(IFileStoreServiceSymbol) private readonly fileStoreService: IFileStoreService,
    private readonly addFileService: AddFileService,
  ) {}

  async execute(dto: UpdateMemoryDTO) {
    const currentMemory = await this.memoryRepo.findCompleteById(dto.id);

    if (!currentMemory) {
      throw new GenericErrors.NotFound(`Memória não encontrada`);
    }

    const memory = Memory.create(
      {
        ...currentMemory,
        ipAddress: currentMemory.ipAddress,
        eventId: currentMemory.eventId,
        message: coalesce(dto.message, currentMemory.message),
        identifier: coalesce(dto.identifier, currentMemory.identifier),
        description: coalesce(dto.description, currentMemory.description),
      },
      currentMemory.id,
    );

    if (!isEmpty(dto.image)) {
      const updatedFile = await this.addFileService.execute({
        entityId: memory.id.toValue(),
        file: dto.image,
      });

      if (currentMemory.file && updatedFile) {
        await Promise.all([
          this.fileStoreService.delete(currentMemory.file.path),
          this.fileRepo.delete(currentMemory.file.id),
        ]);
      }
    }

    return this.memoryRepo.update(memory);
  }
}
