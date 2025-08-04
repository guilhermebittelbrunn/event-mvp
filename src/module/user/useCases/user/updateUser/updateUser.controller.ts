import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateUserDTO } from './dto/updateUser.dto';
import { UpdateUserService } from './updateUser.service';

import User from '@/module/user/domain/user/user';
import { ValidatedBody, ValidatedParams } from '@/shared/decorators';
import { GetUser } from '@/shared/decorators/getUser.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { UpdateResponseDTO } from '@/shared/types/common';

@Controller('/user')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
export class UpdateUserController {
  constructor(private readonly useCase: UpdateUserService) {}

  @Put('/:id')
  async handle(
    @GetUser() user: User,
    @ValidatedBody() body: UpdateUserDTO,
    @ValidatedParams('id') id: string,
  ): Promise<UpdateResponseDTO> {
    const result = await this.useCase.execute({ ...body, id });

    return { id: result };
  }
}
