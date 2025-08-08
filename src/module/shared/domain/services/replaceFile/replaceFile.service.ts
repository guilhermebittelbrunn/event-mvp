import { Inject, Injectable } from '@nestjs/common';

import { ReplaceFileDTO } from './replaceFile.dto';

import { IFileRepository, IFileRepositorySymbol } from '../../../repositories/file.repository.interface';
import File from '../../file';

import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import {
  IFileStoreService,
  IFileStoreServiceSymbol,
} from '@/shared/services/fileStore/fileStore.service.interface';

@Injectable()
export class ReplaceFileService {
  constructor(
    @Inject(IFileRepositorySymbol)
    private readonly fileRepository: IFileRepository,
    @Inject(IFileStoreServiceSymbol)
    private readonly fileStoreService: IFileStoreService,
  ) {}

  async execute(dto: ReplaceFileDTO) {
    if (dto.oldFileId) {
      await this.deleteFile(dto.oldFileId);
    }

    const newFile = await this.uploadFile(dto);

    return this.fileRepository.create(newFile);
  }

  private async deleteFile(fileId: string) {
    const oldFile = await this.fileRepository.findById(fileId);

    if (oldFile) {
      await Promise.all([this.fileRepository.delete(oldFile.id), this.fileStoreService.delete(oldFile.path)]);
    }
  }

  private async uploadFile(dto: ReplaceFileDTO) {
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

    return file;
  }
}
