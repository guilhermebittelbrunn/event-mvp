import Plan from '../domain/plan/plan';

import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

export interface IPlanRepository extends IBaseRepository<Plan> {
  list(query?: PaginationQuery): Promise<PaginatedResult<Plan>>;
  findByType(type: PlanTypeEnum): SingleEntityResponse<Plan>;
}

export const IPlanRepositorySymbol = Symbol('IPlanRepository');
