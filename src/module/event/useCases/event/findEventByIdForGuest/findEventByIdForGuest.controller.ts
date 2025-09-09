import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FileEventByIdResponseDTO } from './dto/findEventByIdForGuest.response.dto';
import { FindEventByIdForGuestService } from './findEventByIdForGuest.service';

import EventMapper from '@/module/event/mappers/event.mapper';
import { ValidatedParams } from '@/shared/decorators';
import { JwtEventAuthGuard } from '@/shared/guards/jwtEventAuth.guard';

@Controller('/event/guest')
@ApiTags('event')
@UseGuards(JwtEventAuthGuard)
export class FindEventByIdForGuestController {
  constructor(private readonly useCase: FindEventByIdForGuestService) {}

  @Get('/:id')
  async handle(@ValidatedParams('id') id: string): Promise<FileEventByIdResponseDTO> {
    const result = await this.useCase.execute(id);

    return EventMapper.toDTO(result);
  }
}
