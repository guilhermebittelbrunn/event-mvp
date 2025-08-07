import { Module } from '@nestjs/common';

import { DeleteMemoryController } from './deleteMemory.controller';
import { DeleteMemoryService } from './deleteMemory.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';

@Module({
  controllers: [DeleteMemoryController],
  providers: [
    DeleteMemoryService,
    {
      provide: IMemoryRepositorySymbol,
      useClass: MemoryRepository,
    },
  ],
})
export class DeleteMemoryModule {}
