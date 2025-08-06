import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ListEventsService } from './listEvents.service';

import { EventDTO } from '@/module/event/dto/event.dto';
import EventMapper from '@/module/event/mappers/event.mapper';
import User from '@/module/user/domain/user/user';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { ValidatedQuery } from '@/shared/decorators';
import { GetUser } from '@/shared/decorators/getUser.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { ApiListResponse } from '@/shared/infra/docs/swagger/decorators/apiListResponse.decorator';
import { ListResponseDTO } from '@/shared/types/common';
import { UserTypeEnum } from '@/shared/types/user';

@Controller('/event')
@ApiTags('event')
@UseGuards(JwtAuthGuard)
export class ListEventsController {
  constructor(private readonly useCase: ListEventsService) {}

  @Get()
  @ApiListResponse(EventDTO)
  async handle(
    @GetUser() user: User,
    @ValidatedQuery() query?: PaginationQuery,
  ): Promise<ListResponseDTO<EventDTO>> {
    const isAdmin = user.type.value === UserTypeEnum.ADMIN;

    const result = await this.useCase.execute({
      ...query,
      ...(!isAdmin && { userId: user.id }),
    });

    return {
      data: result.data.map(EventMapper.toDTO),
      meta: result.meta,
    };
  }
}
