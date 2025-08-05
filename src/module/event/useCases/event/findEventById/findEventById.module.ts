import { Module } from '@nestjs/common';

import { FindEventByIdController } from './findEventById.controller';
import { FindEventByIdService } from './findEventById.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';

@Module({
  controllers: [FindEventByIdController],
  providers: [
    FindEventByIdService,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
  ],
})
export class FindEventByIdModule {}
