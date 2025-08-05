import EventConfig from '../domain/eventConfig';

import { IBaseRepository } from '@/shared/core/infra/repository.interface';

export interface IEventConfigRepository extends IBaseRepository<EventConfig> {}

export const IEventConfigRepositorySymbol = Symbol('IEventConfigRepository');
