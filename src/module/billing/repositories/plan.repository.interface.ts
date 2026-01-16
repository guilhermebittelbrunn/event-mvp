import Plan from '../domain/plan/plan';

import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

export interface IPlanRepository extends IBaseRepository<Plan> {
  findByType(type: PlanTypeEnum): SingleEntityResponse<Plan>;
}

export const IPlanRepositorySymbol = Symbol('IPlanRepository');
