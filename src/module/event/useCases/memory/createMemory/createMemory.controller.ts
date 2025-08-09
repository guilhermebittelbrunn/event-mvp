import { FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { Controller, Post, UseGuards, Inject, Ip, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CreateMemoryService } from './createMemory.service';
import { CreateMemoryDTO } from './dto/createMemory.dto';

import Event from '@/module/event/domain/event/event';
import { MemoryDTO } from '@/module/event/dto/memory.dto';
import MemoryMapper from '@/module/event/mappers/memory.mapper';
import ITransactionManager, {
  ITransactionManagerSymbol,
} from '@/shared/core/infra/transactionManager.interface';
import { ValidatedBody } from '@/shared/decorators';
import { GetEvent } from '@/shared/decorators/getEvent.decorator';
import { EventAuthGuard } from '@/shared/guards/eventAuth/eventAuth.guard';
import { FileValidatorInterceptor } from '@/shared/interceptors/fileValidator.interceptor';

@Controller('/memory')
@ApiTags('memory')
@UseGuards(EventAuthGuard)
export class CreateMemoryController {
  constructor(
    @Inject(ITransactionManagerSymbol)
    private readonly transactionManager: ITransactionManager,
    private readonly useCase: CreateMemoryService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]), FileValidatorInterceptor)
  async handle(
    @GetEvent() event: Event,
    @ValidatedBody() body: CreateMemoryDTO,
    @Ip() ipAddress: string,
    @UploadedFiles() file: { image: File[] },
  ): Promise<MemoryDTO> {
    const payload: CreateMemoryDTO = {
      eventId: event.id.toValue(),
      ipAddress,
      image: file?.image?.[0],
      ...body,
    };

    const result = await this.transactionManager.run(() => this.useCase.execute(payload));

    return MemoryMapper.toDTO(result);
  }
}
