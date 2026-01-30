import { PlanModel } from '@prisma/client';

import Plan from '../domain/plan/plan';
import PlanType from '../domain/plan/planType';
import { PlanDTO } from '../dto/plan.dto';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

export interface PlanModelWithRelations extends PlanModel {}

class BasePlanMapper extends Mapper<Plan, PlanModelWithRelations> {
  toDomain(plan: PlanModelWithRelations): Plan {
    return Plan.create(
      {
        type: PlanType.create(plan.type as PlanTypeEnum),
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        enabled: plan.enabled,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
        deletedAt: plan.deletedAt,
      },
      new UniqueEntityID(plan.id),
    );
  }

  toPersistence(plan: Plan): PlanModel {
    return {
      id: plan.id.toValue(),
      type: plan.type.value,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      enabled: plan.enabled,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      deletedAt: plan.deletedAt,
    };
  }

  toDTO(plan: Plan): PlanDTO {
    return {
      id: plan.id.toValue(),
      type: plan.type.value,
      description: plan.description,
      price: plan.price,
      enabled: plan.enabled,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      deletedAt: plan.deletedAt,
    };
  }
}

const PlanMapper = new BasePlanMapper();

export default PlanMapper;
