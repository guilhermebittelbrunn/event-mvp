import { Controller, Post, UseGuards, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteBulkMemoryService } from './deleteBulkMemory.service';
import { DeleteBulkMemoryDTO } from './dto/deleteBulkMemory.dto';

import ITransactionManager, {
  ITransactionManagerSymbol,
} from '@/shared/core/infra/transactionManager.interface';
import { ValidatedBody } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/memory/delete-bulk')
@ApiTags('memory')
@UseGuards(JwtAuthGuard)
export class DeleteBulkMemoryController {
  constructor(
    @Inject(ITransactionManagerSymbol)
    private readonly transactionManager: ITransactionManager,
    private readonly useCase: DeleteBulkMemoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@ValidatedBody() body: DeleteBulkMemoryDTO): Promise<void> {
    await this.transactionManager.run(() => this.useCase.execute(body));
  }
}
