import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { RegisterLogDTO } from './registerLog.dto';

import { ILogRepository, ILogRepositorySymbol } from '../../../../repositories/log.repository.interface';
import Log from '../../log';
import LogError from '../../logError';
import LogLevel from '../../logLevel';

import { Als } from '@/shared/services/als/als.interface';
import { LogLevelEnum } from '@/shared/types';

@Injectable()
export class RegisterLogService {
  constructor(
    @Inject(ILogRepositorySymbol)
    private readonly logRepository: ILogRepository,
    private readonly als: Als,
    private readonly logger: Logger,
  ) {}

  async execute(dto: RegisterLogDTO) {
    try {
      const requestId = this.als?.getStore()?.requestId;

      const eventId = this.als?.getStore()?.event?.id || dto.eventId;

      let logError: LogError | undefined;

      if (dto.error) {
        logError = LogError.create(dto.error);
      }

      if (dto.logError) {
        logError = dto.logError;
      }

      const logLevel = LogLevel.create(logError ? LogLevelEnum.ERROR : LogLevelEnum.INFO);

      const log = Log.create({
        eventId,
        metadata: dto.payload,
        error: logError,
        service: dto.service,
        method: dto.method,
        level: logLevel,
        requestId,
        message: dto.customMessage,
      });

      await this.logRepository.create(log);
    } catch (error) {
      this.logger.log('Error registering log with payload', dto);
      this.logger.error(error);
    }
  }
}
