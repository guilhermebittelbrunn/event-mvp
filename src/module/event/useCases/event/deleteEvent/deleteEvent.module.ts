import { Module } from '@nestjs/common';

import { DeleteEventController } from './deleteEvent.controller';
import { DeleteEventService } from './deleteEvent.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';

@Module({
  controllers: [DeleteEventController],
  providers: [
    DeleteEventService,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
  ],
})
export class DeleteEventModule {}
