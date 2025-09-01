import { Module } from '@nestjs/common';

import { FindEventBySlugController } from './findEventBySlug.controller';
import { FindEventBySlugService } from './findEventBySlug.service';

import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';

@Module({
  imports: [EventRepositoryFactory],
  controllers: [FindEventBySlugController],
  providers: [FindEventBySlugService],
})
export class FindEventBySlugModule {}
