import { FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { File } from '@nest-lab/fastify-multer';
import { Controller, Inject, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UpdateEventDTO } from './dto/updateEvent.dto';
import { UpdateEventService } from './updateEvent.service';

import ITransactionManager, {
  ITransactionManagerSymbol,
} from '@/shared/core/infra/transactionManager.interface';
import { ValidatedBody, ValidatedParams } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { FileValidatorInterceptor } from '@/shared/interceptors/fileValidator.interceptor';
import { UpdateResponseDTO } from '@/shared/types/common';

@Controller('/event')
@ApiTags('event')
@UseGuards(JwtAuthGuard)
export class UpdateEventController {
  constructor(
    @Inject(ITransactionManagerSymbol)
    private readonly transactionManager: ITransactionManager,
    private readonly useCase: UpdateEventService,
  ) {}

  @Put('/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]), FileValidatorInterceptor)
  async handle(
    @ValidatedBody() body: UpdateEventDTO,
    @ValidatedParams('id') id: string,
    @UploadedFiles() file: { image?: File[] },
  ): Promise<UpdateResponseDTO> {
    const payload: UpdateEventDTO = { ...body, id, image: file?.image?.[0] };

    const result = await this.transactionManager.run(() => this.useCase.execute(payload));

    return { id: result };
  }
}
