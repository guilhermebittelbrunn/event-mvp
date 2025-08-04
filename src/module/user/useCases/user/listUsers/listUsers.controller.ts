import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ListUsersService } from './listUsers.service';

import { UserDTO } from '@/module/user/dto/user.dto';
import UserMapper from '@/module/user/mappers/user.mapper';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { ValidatedQuery } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { ApiListResponse } from '@/shared/infra/docs/swagger/decorators/apiListResponse.decorator';
import { ListResponseDTO } from '@/shared/types/common';

@Controller('/user')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
export class ListUsersController {
  constructor(private readonly useCase: ListUsersService) {}

  @Get()
  @ApiListResponse(UserDTO)
  async handle(@ValidatedQuery() query?: PaginationQuery): Promise<ListResponseDTO<UserDTO>> {
    const result = await this.useCase.execute(query);

    return {
      data: result.data.map(UserMapper.toDTO),
      meta: result.meta,
    };
  }
}
