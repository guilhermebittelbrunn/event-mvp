import { faker } from '@faker-js/faker/.';
import { File } from '@nest-lab/fastify-multer';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateMemoryService } from './createMemory.service';
import { CreateMemoryDTO } from './dto/createMemory.dto';

import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { FakeMemoryRepository } from '@/module/event/repositories/tests/repositories/fakeMemory.repository';
import { AddFileService } from '@/module/shared/domain/services/addFile.service';
import { fakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { FakeFileRepository } from '@/module/shared/repositories/tests/repositories/fakeFile.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { FakeFileStoreService } from '@/shared/test/services';

const makePayload = (overrides?: Partial<CreateMemoryDTO>): CreateMemoryDTO => {
  return {
    eventId: faker.string.uuid(),
    ipAddress: faker.internet.ip(),
    identifier: faker.string.uuid(),
    description: faker.lorem.sentence(),
    message: faker.lorem.sentence(),
    image: makeFile(),
    ...overrides,
  };
};

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

describe('CreateMemoryService', () => {
  let service: CreateMemoryService;

  const memoryRepoMock = new FakeMemoryRepository();
  const fileRepoMock = new FakeFileRepository();
  const fileStoreServiceMock = new FakeFileStoreService();

  const addFileService = new AddFileService(fileRepoMock, fileStoreServiceMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMemoryService,
        {
          provide: IMemoryRepositorySymbol,
          useValue: memoryRepoMock,
        },
        {
          provide: AddFileService,
          useValue: addFileService,
        },
      ],
    }).compile();

    service = module.get<CreateMemoryService>(CreateMemoryService);

    fileRepoMock.create.mockResolvedValueOnce(fakeFile());
    fileStoreServiceMock.upload.mockResolvedValueOnce(faker.internet.url());

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a memory successfully', async () => {
    const payload = makePayload();

    const memory = fakeMemory(payload);

    memoryRepoMock.create.mockResolvedValueOnce(memory);

    const result = await service.execute(payload);

    expect(memoryRepoMock.create).toHaveBeenCalled();
    expect(fileRepoMock.create).toHaveBeenCalled();
    expect(fileStoreServiceMock.upload).toHaveBeenCalled();

    expect(result.id.toValue()).toEqual(memory.id.toValue());
    expect(result.eventId.toValue()).toEqual(memory.eventId.toValue());
    expect(result.ipAddress.value).toEqual(memory.ipAddress.value);
    expect(result.message).toEqual(memory.message);
  });

  it('should throw an error if the ip address is not valid', async () => {
    process.env.NODE_ENV = 'staging';

    const payload = makePayload({ ipAddress: 'invalid' });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(memoryRepoMock.create).not.toHaveBeenCalled();

    process.env.NODE_ENV = 'test';
  });

  it('should throw an error if the event id is not valid', async () => {
    const payload = makePayload({ eventId: 'invalid' });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(memoryRepoMock.create).not.toHaveBeenCalled();
  });
});
