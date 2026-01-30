import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ListPlansService } from './listPlans.service';

import { PlanDTO } from '@/module/billing/dto/plan.dto';
import PlanMapper from '@/module/billing/mappers/plan.mapper';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { ValidatedQuery } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { UserRoleGuard } from '@/shared/guards/userRole.guard';
import { ApiListResponse } from '@/shared/infra/docs/swagger/decorators/apiListResponse.decorator';
import { ListResponseDTO } from '@/shared/types/common';

@Controller('/plan')
@ApiTags('plan')
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class ListPlansController {
  constructor(private readonly useCase: ListPlansService) {}

  @Get()
  @ApiListResponse(PlanDTO)
  async handle(@ValidatedQuery() query?: PaginationQuery): Promise<ListResponseDTO<PlanDTO>> {
    const result = await this.useCase.execute(query);

    return {
      data: result.data.map(PlanMapper.toDTO),
      meta: result.meta,
    };
  }
}
