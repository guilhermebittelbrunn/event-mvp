import { Module } from '@nestjs/common';

import { UpdateEventConfigModule } from './updateEventConfig/updateEventConfig.module';

@Module({
  imports: [UpdateEventConfigModule],
})
export class EventConfigModule {}
