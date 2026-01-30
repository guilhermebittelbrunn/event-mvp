import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindPlanByIdService } from './findPlanById.service';

import { PlanDTO } from '@/module/billing/dto/plan.dto';
import PlanMapper from '@/module/billing/mappers/plan.mapper';
import { ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/plan')
@ApiTags('plan')
@UseGuards(JwtAuthGuard)
export class FindPlanByIdController {
  constructor(private readonly useCase: FindPlanByIdService) {}

  @Get('/:id')
  async handle(@ValidatedParams('id') id: string): Promise<PlanDTO> {
    const result = await this.useCase.execute(id);

    return PlanMapper.toDTO(result);
  }
}
