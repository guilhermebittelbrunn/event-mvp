import { Inject, Injectable } from '@nestjs/common';

import {
  IPlanRepository,
  IPlanRepositorySymbol,
} from '@/module/billing/repositories/plan.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

@Injectable()
export class FindPlanByIdService {
  constructor(@Inject(IPlanRepositorySymbol) private readonly planRepo: IPlanRepository) {}

  async execute(id: string) {
    const plan = await this.planRepo.findById(id);

    if (!plan) {
      throw new GenericErrors.NotFound(`Plano não encontrado`);
    }

    return plan;
  }
}
