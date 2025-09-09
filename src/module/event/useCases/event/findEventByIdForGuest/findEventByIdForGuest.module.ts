import { Module } from '@nestjs/common';

import { FindEventByIdForGuestController } from './findEventByIdForGuest.controller';
import { FindEventByIdForGuestService } from './findEventByIdForGuest.service';

import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';

@Module({
  imports: [EventRepositoryFactory],
  controllers: [FindEventByIdForGuestController],
  providers: [FindEventByIdForGuestService],
})
export class FindEventByIdForGuestModule {}
