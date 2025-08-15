import { Module } from '@nestjs/common';

import { FindEventByIdController } from './findEventById.controller';
import { FindEventByIdService } from './findEventById.service';

import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';

@Module({
  imports: [EventRepositoryFactory],
  controllers: [FindEventByIdController],
  providers: [FindEventByIdService],
})
export class FindEventByIdModule {}
