import { Global, Module } from '@nestjs/common';

import { ValidateEventAccess } from './validateEventAccess.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { makeEventRepository } from '@/module/event/repositories/implementations/factories/event.repository';
import { AlsModule } from '@/shared/services/als/als.module';

@Global()
@Module({
  imports: [AlsModule],
  providers: [
    ValidateEventAccess,
    {
      provide: IEventRepositorySymbol,
      useValue: makeEventRepository(),
    },
  ],
  exports: [ValidateEventAccess],
})
export class ValidateEventAccessModule {}
