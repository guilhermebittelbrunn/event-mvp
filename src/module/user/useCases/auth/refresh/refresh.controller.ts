import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RefreshService } from './refresh.service';

import User from '@/module/user/domain/user/user';
import UserMapper from '@/module/user/mappers/user.mapper';
import { GetUser } from '@/shared/decorators/getUser.decorator';
import { JwtRefreshGuard } from '@/shared/guards/jwtRefresh.guard';

@Controller('/auth/refresh')
@ApiTags('auth')
@UseGuards(JwtRefreshGuard)
export class RefreshController {
  constructor(private readonly useCase: RefreshService) {}

  @Post()
  async handle(@GetUser() user: User) {
    const { tokens, user: userData } = await this.useCase.execute(user.id?.toValue());

    return { tokens, user: UserMapper.toDTO(userData) };
  }
}
