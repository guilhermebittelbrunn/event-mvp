import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateBulkMemoryDTO } from './dto/updateBulkMemory.dto';
import { UpdateBulkMemoryService } from './updateBulkMemory.service';

import { ValidatedBody } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { RawID } from '@/shared/types/common';

@Controller('/memory')
@ApiTags('memory')
@UseGuards(JwtAuthGuard)
export class UpdateBulkMemoryController {
  constructor(private readonly useCase: UpdateBulkMemoryService) {}

  @Put('/bulk')
  async handle(@ValidatedBody() body: UpdateBulkMemoryDTO): Promise<{ ids: RawID[] }> {
    const result = await this.useCase.execute(body);

    return { ids: result };
  }
}
