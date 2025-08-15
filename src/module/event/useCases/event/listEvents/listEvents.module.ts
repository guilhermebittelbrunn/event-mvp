import { Module } from '@nestjs/common';

import { ListEventsController } from './listEvents.controller';
import { ListEventsService } from './listEvents.service';

import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';

@Module({
  imports: [EventRepositoryFactory],
  controllers: [ListEventsController],
  providers: [ListEventsService],
})
export class ListEventsModule {}
