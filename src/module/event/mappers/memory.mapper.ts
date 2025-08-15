import { MemoryModel } from '@prisma/client';

import IpAddress from '../domain/ipAddress';
import Memory from '../domain/memory/memory';
import { MemoryDTO } from '../dto/memory.dto';

import FileMapper, { FileModelWithRelations } from '@/module/shared/mappers/file.mapper';
import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';

export interface MemoryModelWithRelations extends MemoryModel {
  file?: FileModelWithRelations;
}

class BaseMemoryMapper extends Mapper<Memory, MemoryModelWithRelations, MemoryDTO> {
  toDomain(memory: MemoryModelWithRelations): Memory {
    return Memory.create(
      {
        eventId: new UniqueEntityID(memory.eventId),
        fileId: UniqueEntityID.createOrUndefined(memory.fileId),
        identifier: memory.identifier,
        description: memory.description,
        ipAddress: IpAddress.create(memory.ipAddress),
        message: memory.message,
        createdAt: memory.createdAt,
        updatedAt: memory.updatedAt,
        deletedAt: memory.deletedAt,
        file: FileMapper.toDomainOrNull(memory.file),
      },
      new UniqueEntityID(memory.id),
    );
  }

  toPersistence(memory: Memory): MemoryModel {
    return {
      id: memory.id.toValue(),
      eventId: memory.eventId.toValue(),
      fileId: memory.fileId?.toValue(),
      identifier: memory.identifier,
      description: memory.description,
      ipAddress: memory.ipAddress.value,
      message: memory.message,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
      deletedAt: memory.deletedAt,
    };
  }

  toDTO(memory: Memory): MemoryDTO {
    return {
      id: memory.id.toValue(),
      eventId: memory.eventId.toValue(),
      fileId: memory.fileId?.toValue(),
      identifier: memory.identifier,
      description: memory.description,
      message: memory.message,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
      deletedAt: memory.deletedAt,
      file: FileMapper.toDTOOrNull(memory.file),
    };
  }
}

const MemoryMapper = new BaseMemoryMapper();

export default MemoryMapper;
