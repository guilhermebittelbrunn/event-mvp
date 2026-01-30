import { Module } from '@nestjs/common';

import { FindPlanByIdController } from './findPlanById.controller';
import { FindPlanByIdService } from './findPlanById.service';

import { PlanRepository } from '@/module/billing/repositories/implementations/plan.repository';
import { IPlanRepositorySymbol } from '@/module/billing/repositories/plan.repository.interface';

@Module({
  controllers: [FindPlanByIdController],
  providers: [
    FindPlanByIdService,
    {
      provide: IPlanRepositorySymbol,
      useClass: PlanRepository,
    },
  ],
})
export class FindPlanByIdModule {}
