import { Module } from '@nestjs/common';

import { CreateEventController } from './createEvent.controller';
import { CreateEventService } from './createEvent.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';

@Module({
  controllers: [CreateEventController],
  providers: [
    CreateEventService,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
  ],
})
export class CreateEventModule {}
