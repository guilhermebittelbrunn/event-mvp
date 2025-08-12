import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { Test, TestingModule } from '@nestjs/testing';

import { AddFileService } from './addFile.service';

import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import { fakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { FakeFileRepository } from '@/module/shared/repositories/tests/repositories/fakeFile.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { FakeFileStoreService } from '@/shared/test/services';

const makeFile = (overrides?: File) => {
  return {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 100,
    ...overrides,
  };
};

describe('AddFileService', () => {
  let service: AddFileService;

  const fileRepoMock = new FakeFileRepository();
  const fileStoreServiceMock = new FakeFileStoreService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddFileService,
        {
          provide: IFileRepositorySymbol,
          useValue: fileRepoMock,
        },
        {
          provide: IFileStoreServiceSymbol,
          useValue: fileStoreServiceMock,
        },
      ],
    }).compile();

    service = module.get<AddFileService>(AddFileService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a file successfully', async () => {
    const memory = fakeMemory();
    const url = faker.internet.url();
    const file = fakeFile({ entityId: memory.id.toValue(), url });

    fileStoreServiceMock.upload.mockResolvedValueOnce(url);
    fileRepoMock.create.mockResolvedValueOnce(file);

    const result = await service.execute({ entityId: memory.id.toValue(), file: makeFile() });

    expect(fileRepoMock.create).toHaveBeenCalled();
    expect(fileStoreServiceMock.upload).toHaveBeenCalled();
    expect(result).toBe(file);
    expect(result.entityId.toValue()).toBe(memory.id.toValue());
    expect(result.url).toBe(url);
  });

  it('should throw an error if the file store service throws an error', async () => {
    const memory = fakeMemory();

    fileStoreServiceMock.upload.mockRejectedValueOnce(new Error('File store service error'));

    await expect(service.execute({ entityId: memory.id.toValue(), file: makeFile() })).rejects.toThrow(
      GenericErrors.Unexpected,
    );
  });
});
