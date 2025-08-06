import EventAccess from '../domain/eventAccess/eventAccess';
import { EventAccesses } from '../domain/eventAccess/eventAccesses';

import { IBaseRepository } from '@/shared/core/infra/repository.interface';

export interface IEventAccessRepository extends IBaseRepository<EventAccess> {
  saveMany(accesses: EventAccesses): Promise<void>;
}

export const IEventAccessRepositorySymbol = Symbol('IEventAccessRepository');
