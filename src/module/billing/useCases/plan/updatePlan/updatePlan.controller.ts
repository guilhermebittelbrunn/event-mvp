import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdatePlanDTO } from './dto/updatePlan.dto';
import { UpdatePlanService } from './updatePlan.service';

import { ValidatedBody, ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { UserRoleGuard } from '@/shared/guards/userRole.guard';
import { UpdateResponseDTO } from '@/shared/types/common';

@Controller('/plan')
@ApiTags('plan')
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class UpdatePlanController {
  constructor(private readonly useCase: UpdatePlanService) {}

  @Put('/:id')
  async handle(
    @ValidatedBody() body: UpdatePlanDTO,
    @ValidatedParams('id') id: string,
  ): Promise<UpdateResponseDTO> {
    const result = await this.useCase.execute({ ...body, id });

    return { id: result };
  }
}
