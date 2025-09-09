import { Inject, Injectable } from '@nestjs/common';

import { ListMemoriesDTO } from './dto/listMemories.dto';

import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';

@Injectable()
export class ListMemoriesService {
  constructor(@Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository) {}

  async execute({ eventId, ...params }: ListMemoriesDTO) {
    return this.memoryRepo.listWithFiles(eventId, params);
  }
}
