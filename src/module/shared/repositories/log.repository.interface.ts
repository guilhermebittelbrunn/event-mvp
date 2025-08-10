import Log from '../domain/log/log';

import { IBaseRepository } from '@/shared/core/infra/repository.interface';

export interface ILogRepository extends IBaseRepository<Log> {}

export const ILogRepositorySymbol = Symbol('ILogRepository');
