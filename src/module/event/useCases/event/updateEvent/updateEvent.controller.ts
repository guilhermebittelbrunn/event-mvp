import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateEventDTO } from './dto/updateEvent.dto';
import { UpdateEventService } from './updateEvent.service';

import { ValidatedBody, ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { UpdateResponseDTO } from '@/shared/types/common';

@Controller('/event')
@ApiTags('event')
@UseGuards(JwtAuthGuard)
export class UpdateEventController {
  constructor(private readonly useCase: UpdateEventService) {}

  @Put('/:id')
  async handle(
    @ValidatedBody() body: UpdateEventDTO,
    @ValidatedParams('id') id: string,
  ): Promise<UpdateResponseDTO> {
    const result = await this.useCase.execute({ ...body, id });

    return { id: result };
  }
}
