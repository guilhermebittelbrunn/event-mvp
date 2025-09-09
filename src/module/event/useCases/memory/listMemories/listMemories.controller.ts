import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ListMemoriesDTO } from './dto/listMemories.dto';
import { ListMemoriesService } from './listMemories.service';

import { MemoryDTO } from '@/module/event/dto/memory.dto';
import MemoryMapper from '@/module/event/mappers/memory.mapper';
import { ValidatedQuery } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { ApiListResponse } from '@/shared/infra/docs/swagger/decorators/apiListResponse.decorator';
import { ListResponseDTO } from '@/shared/types/common';

@Controller('/memory')
@ApiTags('memory')
@UseGuards(JwtAuthGuard)
export class ListMemoriesController {
  constructor(private readonly useCase: ListMemoriesService) {}

  @Get()
  @ApiListResponse(MemoryDTO)
  async handle(@ValidatedQuery() query?: ListMemoriesDTO): Promise<ListResponseDTO<MemoryDTO>> {
    const result = await this.useCase.execute(query);

    return {
      data: result.data.map(MemoryMapper.toDTO),
      meta: result.meta,
    };
  }
}
