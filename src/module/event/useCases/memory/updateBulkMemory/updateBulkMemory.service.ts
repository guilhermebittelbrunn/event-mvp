import { Injectable } from '@nestjs/common';

import { UpdateBulkMemoryDTO } from './dto/updateBulkMemory.dto';

import { UpdateMemoryService } from '../updateMemory/updateMemory.service';

import GenericErrors from '@/shared/core/logic/genericErrors';
import { RawID } from '@/shared/types';

const LIMIT_MEMORY_IDS_TO_UPDATE = 30;

@Injectable()
export class UpdateBulkMemoryService {
  constructor(private readonly updateMemory: UpdateMemoryService) {}

  async execute(dto: UpdateBulkMemoryDTO) {
    const updatedIds: RawID[] = [];

    if (dto.memories.length > LIMIT_MEMORY_IDS_TO_UPDATE) {
      throw new GenericErrors.InvalidParam(
        `Você pode atualizar no máximo ${LIMIT_MEMORY_IDS_TO_UPDATE} memórias por vez`,
      );
    }

    for (const memory of dto.memories) {
      const updatedId = await this.updateMemory.execute(memory);
      updatedIds.push(updatedId);
    }

    return updatedIds;
  }
}
