import { Module } from '@nestjs/common';

import { ListMemoriesController } from './listMemories.controller';
import { ListMemoriesService } from './listMemories.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';

@Module({
  controllers: [ListMemoriesController],
  providers: [
    ListMemoriesService,
    {
      provide: IMemoryRepositorySymbol,
      useClass: MemoryRepository,
    },
  ],
})
export class ListMemoriesModule {}
