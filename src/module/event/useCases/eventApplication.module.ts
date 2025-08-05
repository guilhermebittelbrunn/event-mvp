import { Module } from '@nestjs/common';

import { EventModule } from './event/event.module';
import { EventConfigModule } from './eventConfig/eventConfig.module';

@Module({
  imports: [EventModule, EventConfigModule],
})
export class EventApplicationModule {}
