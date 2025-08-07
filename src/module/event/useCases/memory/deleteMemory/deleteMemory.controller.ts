import { Controller, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteMemoryService } from './deleteMemory.service';

import { ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/memory')
@ApiTags('memory')
@UseGuards(JwtAuthGuard)
export class DeleteMemoryController {
  constructor(private readonly useCase: DeleteMemoryService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@ValidatedParams('id') id: string): Promise<void> {
    await this.useCase.execute(id);
  }
}
