import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FileEventByIdResponseDTO } from './dto/findEventBySlug.response.dto';
import { FindEventBySlugService } from './findEventBySlug.service';

import EventMapper from '@/module/event/mappers/event.mapper';
import { ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/event')
@ApiTags('event')
@UseGuards(JwtAuthGuard)
export class FindEventBySlugController {
  constructor(private readonly useCase: FindEventBySlugService) {}

  @Get('/slug/:slug')
  async handle(@ValidatedParams('slug', { type: 'string' }) slug: string): Promise<FileEventByIdResponseDTO> {
    const result = await this.useCase.execute(slug);

    return EventMapper.toDTO(result);
  }
}
