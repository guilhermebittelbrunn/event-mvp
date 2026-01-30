import { Module } from '@nestjs/common';

import { UpdatePlanController } from './updatePlan.controller';
import { UpdatePlanService } from './updatePlan.service';

import { PlanRepository } from '@/module/billing/repositories/implementations/plan.repository';
import { IPlanRepositorySymbol } from '@/module/billing/repositories/plan.repository.interface';

@Module({
  controllers: [UpdatePlanController],
  providers: [
    UpdatePlanService,
    {
      provide: IPlanRepositorySymbol,
      useClass: PlanRepository,
    },
  ],
})
export class UpdatePlanModule {}
