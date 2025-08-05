import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ListEventsService } from './listEvents.service';

import { EventDTO } from '@/module/event/dto/event.dto';
import EventMapper from '@/module/event/mappers/event.mapper';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { ValidatedQuery } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { ApiListResponse } from '@/shared/infra/docs/swagger/decorators/apiListResponse.decorator';
import { ListResponseDTO } from '@/shared/types/common';

@Controller('/event')
@ApiTags('event')
@UseGuards(JwtAuthGuard)
export class ListEventsController {
  constructor(private readonly useCase: ListEventsService) {}

  @Get()
  @ApiListResponse(EventDTO)
  async handle(@ValidatedQuery() query?: PaginationQuery): Promise<ListResponseDTO<EventDTO>> {
    const result = await this.useCase.execute(query);

    return {
      data: result.data.map(EventMapper.toDTO),
      meta: result.meta,
    };
  }
}
