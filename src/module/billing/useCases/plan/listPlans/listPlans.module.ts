import { Module } from '@nestjs/common';

import { ListPlansController } from './listPlans.controller';
import { ListPlansService } from './listPlans.service';

import { PlanRepository } from '@/module/billing/repositories/implementations/plan.repository';
import { IPlanRepositorySymbol } from '@/module/billing/repositories/plan.repository.interface';

@Module({
  controllers: [ListPlansController],
  providers: [
    ListPlansService,
    {
      provide: IPlanRepositorySymbol,
      useClass: PlanRepository,
    },
  ],
})
export class ListPlansModule {}
