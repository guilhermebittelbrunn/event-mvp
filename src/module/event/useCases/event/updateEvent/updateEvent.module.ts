import { Module } from '@nestjs/common';

import { UpdateEventController } from './updateEvent.controller';
import { UpdateEventService } from './updateEvent.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';

@Module({
  controllers: [UpdateEventController],
  providers: [
    UpdateEventService,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
  ],
})
export class UpdateEventModule {}
