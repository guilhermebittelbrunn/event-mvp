import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateEventConfigDTO } from './dto/updateEventConfig.dto';
import { UpdateEventConfigService } from './updateEventConfig.service';

import { ValidatedBody, ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { UpdateResponseDTO } from '@/shared/types/common';

@Controller('/event')
@ApiTags('event config')
@UseGuards(JwtAuthGuard)
export class UpdateEventConfigController {
  constructor(private readonly useCase: UpdateEventConfigService) {}

  @Put('/:eventId/config/:id')
  async handle(
    @ValidatedBody() body: UpdateEventConfigDTO,
    @ValidatedParams('eventId') eventId: string,
    @ValidatedParams('id') id: string,
  ): Promise<UpdateResponseDTO> {
    const result = await this.useCase.execute({ ...body, id, eventId });

    return { id: result };
  }
}
