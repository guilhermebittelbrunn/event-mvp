import { Module } from '@nestjs/common';

import { FindMemoryByIdController } from './findMemoryById.controller';
import { FindMemoryByIdService } from './findMemoryById.service';

import { MemoryRepository } from '@/module/event/repositories/implementations/memory.repository';
import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';

@Module({
  controllers: [FindMemoryByIdController],
  providers: [
    FindMemoryByIdService,
    {
      provide: IMemoryRepositorySymbol,
      useClass: MemoryRepository,
    },
  ],
})
export class FindMemoryByIdModule {}
