import { Inject, Injectable } from '@nestjs/common';

import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

@Injectable()
export class DeleteMemoryService {
  constructor(@Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository) {}

  async execute(id: string) {
    const deleted = await this.memoryRepo.delete(id);

    if (!deleted) {
      throw new GenericErrors.NotFound(`Memória não encontrada`);
    }
  }
}
