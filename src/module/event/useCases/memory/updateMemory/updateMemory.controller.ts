import { Controller, Inject, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateMemoryDTO } from './dto/updateMemory.dto';
import { UpdateMemoryService } from './updateMemory.service';

import ITransactionManager, {
  ITransactionManagerSymbol,
} from '@/shared/core/infra/transactionManager.interface';
import { ValidatedBody, ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { UpdateResponseDTO } from '@/shared/types/common';

@Controller('/memory')
@ApiTags('memory')
@UseGuards(JwtAuthGuard)
export class UpdateMemoryController {
  constructor(
    @Inject(ITransactionManagerSymbol)
    private readonly transactionManager: ITransactionManager,
    private readonly useCase: UpdateMemoryService,
  ) {}

  @Put('/:id')
  async handle(
    @ValidatedBody() body: UpdateMemoryDTO,
    @ValidatedParams('id') id: string,
  ): Promise<UpdateResponseDTO> {
    const result = await this.transactionManager.run(() => this.useCase.execute({ ...body, id }));

    return { id: result };
  }
}
