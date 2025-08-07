import { FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { File } from '@nest-lab/fastify-multer';
import { Controller, Inject, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UpdateMemoryDTO } from './dto/updateMemory.dto';
import { UpdateMemoryService } from './updateMemory.service';

import ITransactionManager, {
  ITransactionManagerSymbol,
} from '@/shared/core/infra/transactionManager.interface';
import { ValidatedBody, ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { FileValidatorInterceptor } from '@/shared/interceptors/fileValidator.interceptor';
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]), FileValidatorInterceptor)
  async handle(
    @ValidatedBody() body: UpdateMemoryDTO,
    @ValidatedParams('id') id: string,
    @UploadedFiles() file: { image: File[] },
  ): Promise<UpdateResponseDTO> {
    const payload: UpdateMemoryDTO = { image: file?.image?.[0], ...body, id };

    const result = await this.transactionManager.run(() => this.useCase.execute(payload));

    return { id: result };
  }
}
