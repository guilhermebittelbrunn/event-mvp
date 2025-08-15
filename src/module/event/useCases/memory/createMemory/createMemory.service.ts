import { Inject, Injectable } from '@nestjs/common';

import { CreateMemoryDTO } from './dto/createMemory.dto';

import IpAddress from '@/module/event/domain/ipAddress';
import Memory from '@/module/event/domain/memory/memory';
import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import { AddFileService } from '@/module/shared/domain/file/services/addFile/addFile.service';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';

@Injectable()
export class CreateMemoryService {
  constructor(
    @Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository,
    private readonly addFileService: AddFileService,
  ) {}

  async execute(dto: CreateMemoryDTO) {
    if (isEmpty(dto.image)) {
      throw new GenericErrors.InvalidParam('Nenhuma imagem enviada');
    }

    const ipAddress = IpAddress.create(dto.ipAddress);

    const memory = Memory.create({
      ...dto,
      eventId: UniqueEntityID.create(dto.eventId),
      ipAddress,
    });

    const file = await this.addFileService.execute({ file: dto.image });

    memory.fileId = file.id;

    return this.memoryRepo.create(memory);
  }
}
