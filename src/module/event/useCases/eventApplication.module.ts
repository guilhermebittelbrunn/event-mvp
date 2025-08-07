import { Module } from '@nestjs/common';

import { EventModule } from './event/event.module';
import { EventConfigModule } from './eventConfig/eventConfig.module';
import { MemoryModule } from './memory/memory.module';

@Module({
  imports: [EventModule, EventConfigModule, MemoryModule],
})
export class EventApplicationModule {}
