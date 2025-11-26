import { Inject, Injectable } from '@nestjs/common';

import { UpdateMemoryDTO } from './dto/updateMemory.dto';

import Memory from '@/module/event/domain/memory/memory';
import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import { ReplaceFileService } from '@/module/shared/domain/file/services/replaceFile/replaceFile.service';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { coalesce, isEmpty } from '@/shared/core/utils/undefinedHelpers';

@Injectable()
export class UpdateMemoryService {
  constructor(
    @Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository,
    private readonly replaceFileService: ReplaceFileService,
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
        fileId: currentMemory.fileId,
        message: coalesce(dto.message, currentMemory.message),
        identifier: coalesce(dto.identifier, currentMemory.identifier),
        description: coalesce(dto.description, currentMemory.description),
        hidden: coalesce(dto.hidden, currentMemory.hidden),
      },
      currentMemory.id,
    );

    if (!isEmpty(dto.image)) {
      const oldFileId = currentMemory.file?.id.toValue();
      const newFile = await this.replaceFileService.execute({ file: dto.image, oldFileId });

      memory.fileId = newFile.id;
    }

    return this.memoryRepo.update(memory);
  }
}
