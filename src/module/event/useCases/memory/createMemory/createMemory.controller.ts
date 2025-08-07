import { Controller, Post, UseGuards, Inject, Ip } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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

@Controller('/memory')
@ApiTags('memory')
@UseGuards(EventAuthGuard)
export class CreateMemoryController {
  constructor(
    private readonly useCase: CreateMemoryService,
    @Inject(ITransactionManagerSymbol)
    private readonly transactionManager: ITransactionManager,
  ) {}

  @Post()
  async handle(
    @GetEvent() event: Event,
    @ValidatedBody() body: CreateMemoryDTO,
    @Ip() ipAddress: string,
  ): Promise<MemoryDTO> {
    const payload = { eventId: event.id.toValue(), ipAddress, ...body };

    const result = await this.transactionManager.run(() => this.useCase.execute(payload));

    return MemoryMapper.toDTO(result);
  }
}
