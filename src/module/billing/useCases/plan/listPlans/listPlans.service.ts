import { Inject, Injectable } from '@nestjs/common';

import {
  IPlanRepository,
  IPlanRepositorySymbol,
} from '@/module/billing/repositories/plan.repository.interface';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';

@Injectable()
export class ListPlansService {
  constructor(@Inject(IPlanRepositorySymbol) private readonly planRepo: IPlanRepository) {}

  async execute(query: PaginationQuery) {
    return this.planRepo.list(query);
  }
}
