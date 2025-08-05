import { Module } from '@nestjs/common';

import { ListEventsController } from './listEvents.controller';
import { ListEventsService } from './listEvents.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';

@Module({
  controllers: [ListEventsController],
  providers: [
    ListEventsService,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
  ],
})
export class ListEventsModule {}
