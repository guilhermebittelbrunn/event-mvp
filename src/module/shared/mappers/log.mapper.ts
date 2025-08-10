import { LogModel } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

import Log from '../domain/log/log';
import LogLevel from '../domain/log/logLevel';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { LogLevelEnum } from '@/shared/types';

class BaseLogMapper extends Mapper<Log, LogModel> {
  toDomain(log: LogModel): Log {
    return Log.create(
      {
        eventId: new UniqueEntityID(log.eventId),
        metadata: log.metadata as Record<string, unknown>,
        level: LogLevel.create(log.level as LogLevelEnum),
        service: log.service,
        method: log.method,
        message: log.message,
        errorStatus: log.errorStatus,
        errorMessage: log.errorMessage,
        errorStack: log.errorStack,
        createdAt: log.createdAt,
      },
      new UniqueEntityID(log.id),
    );
  }

  toPersistence(log: Log): LogModel {
    return {
      id: log.id.toValue(),
      requestId: log.requestId?.toValue(),
      eventId: log.eventId?.toValue(),
      metadata: log.metadata as JsonValue,
      level: log.level?.value as LogLevelEnum,
      service: log.service,
      method: log.method,
      message: log.message,
      errorStatus: log.errorStatus,
      errorMessage: log.errorMessage,
      errorStack: log.errorStack,
      createdAt: log.createdAt,
    };
  }
}

const LogMapper = new BaseLogMapper();

export default LogMapper;
