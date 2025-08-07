import { Inject, Injectable } from '@nestjs/common';

import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';

@Injectable()
export class ListMemoriesService {
  constructor(@Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository) {}

  async execute(query?: PaginationQuery) {
    return this.memoryRepo.list(query);
  }
}
