import { Global, Module } from '@nestjs/common';

import { Als } from './als.interface';

@Global()
@Module({
  providers: [
    {
      provide: Als,
      useValue: new Als(),
    },
  ],
  exports: [Als],
})
export class AlsModule {}
