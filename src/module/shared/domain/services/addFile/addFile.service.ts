import { Inject, Injectable } from '@nestjs/common';

import { AddFileDTO } from './addFile.dto';

import { IFileRepository, IFileRepositorySymbol } from '../../../repositories/file.repository.interface';
import File from '../../file';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import {
  IFileStoreService,
  IFileStoreServiceSymbol,
} from '@/shared/services/fileStore/fileStore.service.interface';

@Injectable()
export class AddFileService {
  constructor(
    @Inject(IFileRepositorySymbol)
    private readonly fileRepository: IFileRepository,
    @Inject(IFileStoreServiceSymbol)
    private readonly fileStoreService: IFileStoreService,
  ) {}

  async execute(dto: AddFileDTO) {
    const file = File.create({
      entityId: UniqueEntityID.create(dto.entityId),
      name: dto.file.originalname,
      path: dto.file.path,
      url: dto.file.path,
      size: dto.file.size,
      file: dto.file,
    });

    const url = await this.fileStoreService.upload({
      fieldname: 'file',
      originalname: dto.file.originalname,
      encoding: file.file.encoding,
      mimetype: file.file.mimetype,
      buffer: file.file.buffer,
      path: file.path,
    });

    file.url = url;

    return this.fileRepository.create(file);
  }
}
