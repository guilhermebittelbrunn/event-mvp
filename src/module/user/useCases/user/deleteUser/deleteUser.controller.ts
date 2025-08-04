import { Controller, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteUserService } from './deleteUser.service';

import { ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/user')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
export class DeleteUserController {
  constructor(private readonly useCase: DeleteUserService) {}

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@ValidatedParams('id') id: string): Promise<void> {
    await this.useCase.execute(id);
  }
}
