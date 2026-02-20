import { Inject, Injectable } from '@nestjs/common';

import { UpdatePlanDTO } from './dto/updatePlan.dto';

import Plan from '@/module/billing/domain/plan/plan';
import {
  IPlanRepository,
  IPlanRepositorySymbol,
} from '@/module/billing/repositories/plan.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { coalesce, coalesceUndefined, isEmpty } from '@/shared/core/utils/undefinedHelpers';

@Injectable()
export class UpdatePlanService {
  constructor(@Inject(IPlanRepositorySymbol) private readonly planRepo: IPlanRepository) {}

  async execute(dto: UpdatePlanDTO) {
    const currentPlan = await this.planRepo.findById(dto.id);

    if (!currentPlan) {
      throw new GenericErrors.NotFound('Plano não encontrado');
    }

    if (!isEmpty(dto.accessDays) && dto.accessDays < 1) {
      throw new GenericErrors.InvalidParam('O número de dias de acesso deve ser maior que 0');
    }

    const plan = Plan.create(
      {
        type: currentPlan.type,
        price: coalesce(dto.price, currentPlan.price),
        description: coalesce(dto.description, currentPlan.description),
        enabled: coalesce(dto.enabled, currentPlan.enabled),
        currency: currentPlan.currency,
        accessDays: coalesceUndefined(dto.accessDays, currentPlan.accessDays),
        createdAt: currentPlan.createdAt,
        updatedAt: currentPlan.updatedAt,
        deletedAt: currentPlan.deletedAt,
      },
      currentPlan.id,
    );

    return this.planRepo.update(plan);
  }
}
