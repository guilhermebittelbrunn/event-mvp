import { Inject, Injectable } from '@nestjs/common';

import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

@Injectable()
export class FindMemoryByIdService {
  constructor(@Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository) {}

  async execute(id: string) {
    const memory = await this.memoryRepo.findCompleteById(id);

    if (!memory) {
      throw new GenericErrors.NotFound(`Memória não encontrada`);
    }

    return memory;
  }
}
