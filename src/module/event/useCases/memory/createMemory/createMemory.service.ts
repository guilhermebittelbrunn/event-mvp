import { Inject, Injectable } from '@nestjs/common';

import { CreateMemoryDTO } from './dto/createMemory.dto';

import IpAddress from '@/module/event/domain/ipAddress';
import Memory from '@/module/event/domain/memory/memory';
import {
  IMemoryRepository,
  IMemoryRepositorySymbol,
} from '@/module/event/repositories/memory.repository.interface';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';

@Injectable()
export class CreateMemoryService {
  constructor(@Inject(IMemoryRepositorySymbol) private readonly memoryRepo: IMemoryRepository) {}

  async execute(dto: CreateMemoryDTO) {
    const ipAddress = IpAddress.create(dto.ipAddress);

    const memory = Memory.create({
      ...dto,
      eventId: UniqueEntityID.create(dto.eventId),
      ipAddress,
    });

    return this.memoryRepo.create(memory);
  }
}
