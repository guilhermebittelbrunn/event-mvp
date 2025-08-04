import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindUserByIdService } from './findUserById.service';

import { UserDTO } from '@/module/user/dto/user.dto';
import UserMapper from '@/module/user/mappers/user.mapper';
import { ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/user')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
export class FindUserByIdController {
  constructor(private readonly useCase: FindUserByIdService) {}

  @Get('/:id')
  async handle(@ValidatedParams('id') id: string): Promise<UserDTO> {
    const result = await this.useCase.execute(id);

    return UserMapper.toDTO(result);
  }
}
