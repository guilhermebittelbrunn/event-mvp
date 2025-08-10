import { faker } from '@faker-js/faker/.';
import { File } from '@nest-lab/fastify-multer';
import { Test, TestingModule } from '@nestjs/testing';

import { UpdateMemoryService } from './updateMemory.service';

import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { FakeMemoryRepository } from '@/module/event/repositories/tests/repositories/fakeMemory.repository';
import { ReplaceFileService } from '@/module/shared/domain/file/services/replaceFile/replaceFile.service';
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

describe('UpdateMemoryService', () => {
  let service: UpdateMemoryService;

  const memoryRepoMock = new FakeMemoryRepository();
  const fileRepoMock = new FakeFileRepository();
  const fileStoreServiceMock = new FakeFileStoreService();

  const replaceFileService = new ReplaceFileService(fileRepoMock, fileStoreServiceMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMemoryService,
        {
          provide: IMemoryRepositorySymbol,
          useValue: memoryRepoMock,
        },
        {
          provide: IFileRepositorySymbol,
          useValue: fileRepoMock,
        },
        {
          provide: IFileStoreServiceSymbol,
          useValue: fileStoreServiceMock,
        },
        {
          provide: ReplaceFileService,
          useValue: replaceFileService,
        },
      ],
    }).compile();

    service = module.get<UpdateMemoryService>(UpdateMemoryService);

    fileRepoMock.create.mockResolvedValueOnce(fakeFile());
    fileStoreServiceMock.upload.mockResolvedValueOnce(faker.internet.url());

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a memory successfully', async () => {
    const memory = fakeMemory();

    memoryRepoMock.findCompleteById.mockResolvedValueOnce(memory);
    memoryRepoMock.update.mockResolvedValueOnce(memory.id.toValue());

    const result = await service.execute({
      id: memory.id.toValue(),
      message: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      identifier: faker.lorem.words(3),
    });

    expect(result).toBe(memory.id.toValue());
    expect(memoryRepoMock.update).toHaveBeenCalled();
    expect(fileStoreServiceMock.upload).not.toHaveBeenCalled();
    expect(fileStoreServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should replace the file if a new one is provided', async () => {
    const memory = fakeMemory();

    memory.file = fakeFile({ entityId: memory.id.toValue() });

    memoryRepoMock.update.mockResolvedValueOnce(memory.id.toValue());
    memoryRepoMock.findCompleteById.mockResolvedValueOnce(memory);

    const spyReplaceFileService = jest.spyOn(replaceFileService, 'execute');

    const result = await service.execute({
      id: memory.id.toValue(),
      message: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      identifier: faker.lorem.words(3),
      image: makeFile(),
    });

    expect(result).toBe(memory.id.toValue());
    expect(memoryRepoMock.update).toHaveBeenCalled();
    expect(spyReplaceFileService).toHaveBeenCalled();
  });

  it('should throw a not found error if memory does not exist', async () => {
    await expect(
      service.execute({
        id: faker.string.uuid(),
      }),
    ).rejects.toThrow(GenericErrors.NotFound);
  });
});
