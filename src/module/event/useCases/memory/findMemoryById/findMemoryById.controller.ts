import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindMemoryByIdService } from './findMemoryById.service';

import { MemoryDTO } from '@/module/event/dto/memory.dto';
import MemoryMapper from '@/module/event/mappers/memory.mapper';
import { ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/memory')
@ApiTags('memory')
@UseGuards(JwtAuthGuard)
export class FindMemoryByIdController {
  constructor(private readonly useCase: FindMemoryByIdService) {}

  @Get('/:id')
  async handle(@ValidatedParams('id') id: string): Promise<MemoryDTO> {
    const result = await this.useCase.execute(id);

    return MemoryMapper.toDTO(result);
  }
}
