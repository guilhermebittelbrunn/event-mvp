import { Global, Logger, Module } from '@nestjs/common';

import { RegisterLogService } from './registerLog.service';

import { LogRepository } from '../../../../repositories/implementations/log.repository';
import { ILogRepositorySymbol } from '../../../../repositories/log.repository.interface';

@Global()
@Module({
  providers: [
    RegisterLogService,
    {
      provide: ILogRepositorySymbol,
      useClass: LogRepository,
    },
    {
      provide: Logger,
      useValue: new Logger(RegisterLogService.name),
    },
  ],
  exports: [RegisterLogService],
})
export class RegisterLogModule {}
