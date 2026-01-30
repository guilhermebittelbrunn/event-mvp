import { Module } from '@nestjs/common';

import { FindPlanByIdModule } from './findPlanById/findPlanById.module';
import { ListPlansModule } from './listPlans/listPlans.module';
import { UpdatePlanModule } from './updatePlan/updatePlan.module';

@Module({
  imports: [FindPlanByIdModule, ListPlansModule, UpdatePlanModule],
})
export class PlanModule {}
