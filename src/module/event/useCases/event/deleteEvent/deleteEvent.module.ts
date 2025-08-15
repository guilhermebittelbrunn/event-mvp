import { Module } from '@nestjs/common';

import { DeleteEventController } from './deleteEvent.controller';
import { DeleteEventService } from './deleteEvent.service';

import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';

@Module({
  imports: [EventRepositoryFactory],
  controllers: [DeleteEventController],
  providers: [DeleteEventService],
})
export class DeleteEventModule {}
