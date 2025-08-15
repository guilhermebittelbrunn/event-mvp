import { Global, Module } from '@nestjs/common';

import { ValidateEventAccess } from './validateEventAccess.service';

import { EventRepositoryFactory } from '@/module/event/repositories/implementations/factories/event.repository.module';
import { AlsModule } from '@/shared/services/als/als.module';

@Global()
@Module({
  imports: [AlsModule, EventRepositoryFactory],
  providers: [ValidateEventAccess],
  exports: [ValidateEventAccess],
})
export class ValidateEventAccessModule {}
