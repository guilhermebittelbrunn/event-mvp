import LogError from '../../logError';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';

export interface RegisterLogDTO {
  eventId?: UniqueEntityID;
  payload?: Record<string, unknown>;
  error?: Error;
  logError?: LogError;
  service?: string;
  method?: string;
  customMessage?: string;
}
