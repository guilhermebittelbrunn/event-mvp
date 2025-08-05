import { Module } from '@nestjs/common';

import { UpdateEventConfigController } from './updateEventConfig.controller';
import { UpdateEventConfigService } from './updateEventConfig.service';

import { IEventConfigRepositorySymbol } from '@/module/event/repositories/eventConfig.repository.interface';
import { EventConfigRepository } from '@/module/event/repositories/implementations/eventConfig.repository';

@Module({
  controllers: [UpdateEventConfigController],
  providers: [
    UpdateEventConfigService,
    {
      provide: IEventConfigRepositorySymbol,
      useClass: EventConfigRepository,
    },
  ],
})
export class UpdateEventConfigModule {}
