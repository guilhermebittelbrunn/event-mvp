import { prisma } from '@database/index';
import { PlanModel } from '@prisma/client';

import Plan from '@/module/billing/domain/plan/plan';
import PlanType from '@/module/billing/domain/plan/planType';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

export function fakePlan({ id, ...overrides }: Partial<Plan> = {}): Plan {
  return Plan.create(
    {
      type: PlanType.create(PlanTypeEnum.EVENT_BASIC),
      price: overrides?.price ?? 0,
      description: overrides?.description ?? '',
      accessDays: overrides?.accessDays ?? 0,
      enabled: overrides?.enabled ?? true,
      currency: overrides?.currency ?? 'BRL',
      createdAt: overrides?.createdAt ?? new Date(),
      updatedAt: overrides?.updatedAt ?? new Date(),
      deletedAt: overrides?.deletedAt ?? null,
      ...overrides,
    },
    id,
  );
}

export async function insertFakePlan(overrides: Partial<PlanModel> = {}): Promise<PlanModel> {
  const plan = fakePlan();

  return prisma.planModel.create({
    data: {
      id: plan.id.toValue(),
      type: plan.type.value,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      enabled: plan.enabled,
      accessDays: plan.accessDays,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      deletedAt: plan.deletedAt,
      ...overrides,
    },
  });
}
