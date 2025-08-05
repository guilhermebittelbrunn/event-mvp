import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindEventByIdService } from './findEventById.service';

import { EventDTO } from '@/module/event/dto/event.dto';
import EventMapper from '@/module/event/mappers/event.mapper';
import { ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/event')
@ApiTags('event')
@UseGuards(JwtAuthGuard)
export class FindEventByIdController {
  constructor(private readonly useCase: FindEventByIdService) {}

  @Get('/:id')
  async handle(@ValidatedParams('id') id: string): Promise<EventDTO> {
    const result = await this.useCase.execute(id);

    return EventMapper.toDTO(result);
  }
}
