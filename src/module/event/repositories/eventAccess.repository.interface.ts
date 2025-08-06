import EventAccess from '../domain/eventAccess/eventAccess';
import { EventAccesses } from '../domain/eventAccess/eventAccesses';

import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { GenericId } from '@/shared/types/common';

export interface IEventAccessRepository extends IBaseRepository<EventAccess> {
  saveMany(accesses: EventAccesses): Promise<void>;
  findWithEvent(id: GenericId): SingleEntityResponse<EventAccess>;
}

export const IEventAccessRepositorySymbol = Symbol('IEventAccessRepository');
