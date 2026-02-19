import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindEventBySlugService } from './findEventBySlug.service';

import { EventDTO } from '@/module/event/dto/event.dto';
import EventMapper from '@/module/event/mappers/event.mapper';
import { ValidatedParams } from '@/shared/decorators';

@Controller('/event')
@ApiTags('event')
export class FindEventBySlugController {
  constructor(private readonly useCase: FindEventBySlugService) {}

  @Get('/slug/:slug')
  async handle(@ValidatedParams('slug', { type: 'string' }) slug: string): Promise<EventDTO> {
    const result = await this.useCase.execute(slug);

    return EventMapper.toDTO(result);
  }
}
