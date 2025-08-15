import { FileModel } from '@prisma/client';

import File from '../domain/file/file';
import { FileDTO } from '../dto/file.dto';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';

export interface FileModelWithRelations extends FileModel {}

class BaseFileMapper extends Mapper<File, FileModelWithRelations, FileDTO> {
  toDomain(file: FileModelWithRelations): File {
    return File.create(
      {
        name: file.name,
        path: file.path,
        size: file.size,
        url: file.url,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        deletedAt: file.deletedAt,
      },
      new UniqueEntityID(file.id),
    );
  }

  toPersistence(file: File): FileModel {
    return {
      id: file.id.toValue(),
      name: file.name,
      path: file.path,
      size: file.size,
      url: file.url,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt,
    };
  }

  toDTO(file: File): FileDTO {
    return {
      id: file.id.toValue(),
      name: file.name,
      path: file.path,
      size: file.size,
      url: file.url,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt,
    };
  }
}

const FileMapper = new BaseFileMapper();

export default FileMapper;
