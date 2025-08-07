import { Inject, Injectable } from '@nestjs/common';

import { UpdateMemoryDTO } from './dto/updateMemory.dto';

import Memory from '@/module/event/domain/memory/memory';
import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { coalesce } from '@/shared/core/utils/undefinedHelpers';

@Injectable()
export class UpdateMemoryService {
  constructor(@Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository) {}

  async execute(dto: UpdateMemoryDTO) {
    const currentMemory = await this.memoryRepo.findById(dto.id);

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

    return this.memoryRepo.update(memory);
  }
}
