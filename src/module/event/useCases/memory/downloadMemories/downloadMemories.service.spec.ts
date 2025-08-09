import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import { Readable } from 'stream';

import DownloadMemoriesErrors from './downloadMemories.error';
import { DownloadMemoriesService } from './downloadMemories.service';
import { DownloadMemoriesDTO } from './dto/downloadMemories.dto';

import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { FakeMemoryRepository } from '@/module/event/repositories/tests/repositories/fakeMemory.repository';
import { fakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { FakeFileStoreService } from '@/shared/test/services';

const makePayload = (overrides?: Partial<DownloadMemoriesDTO>): DownloadMemoriesDTO => {
  return {
    memoryIds: [faker.string.uuid(), faker.string.uuid()],
    ...overrides,
  };
};

const createMockReadableStream = (): Readable => {
  const stream = new Readable({
    read() {
      this.push('mock file content');
      this.push(null);
    },
  });
  return stream;
};

describe('DownloadMemoriesService', () => {
  let service: DownloadMemoriesService;
  let memoryRepoMock: FakeMemoryRepository;
  let fileStoreServiceMock: FakeFileStoreService;

  beforeEach(async () => {
    memoryRepoMock = new FakeMemoryRepository();
    fileStoreServiceMock = new FakeFileStoreService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DownloadMemoriesService,
        {
          provide: IMemoryRepositorySymbol,
          useValue: memoryRepoMock,
        },
        {
          provide: IFileStoreServiceSymbol,
          useValue: fileStoreServiceMock,
        },
      ],
    }).compile();

    service = module.get<DownloadMemoriesService>(DownloadMemoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should download memories successfully', async () => {
    const payload = makePayload();
    const memories = [fakeMemory({ id: payload.memoryIds[0] }), fakeMemory({ id: payload.memoryIds[1] })];

    memories[0].file = fakeFile();
    memories[1].file = fakeFile();

    memoryRepoMock.findAllForDownload.mockResolvedValue(memories);
    fileStoreServiceMock.getFile.mockResolvedValue(createMockReadableStream());

    const result = await service.execute(payload);

    expect(memoryRepoMock.findAllForDownload).toHaveBeenCalledWith(payload.memoryIds);
    expect(fileStoreServiceMock.getFile).toHaveBeenCalledTimes(2);
    expect(result).toBeDefined();
  });

  it('should throw error when too many memory ids are provided', async () => {
    const payload = makePayload({
      memoryIds: Array(31).fill(faker.string.uuid()),
    });

    await expect(service.execute(payload)).rejects.toThrow(
      DownloadMemoriesErrors.MaxMemoryIdsToDownloadExceeded,
    );
  });

  it('should throw error when memories are not found', async () => {
    const payload = makePayload();

    memoryRepoMock.findAllForDownload.mockResolvedValue([]);

    await expect(service.execute(payload)).rejects.toThrow(DownloadMemoriesErrors.MemoriesNotFound);
  });

  it('should throw error when no files are found', async () => {
    const payload = makePayload();
    const memories = [fakeMemory({ id: payload.memoryIds[0] }), fakeMemory({ id: payload.memoryIds[1] })];

    memories[0].file = null;
    memories[1].file = null;

    memoryRepoMock.findAllForDownload.mockResolvedValue(memories);

    await expect(service.execute(payload)).rejects.toThrow(DownloadMemoriesErrors.NoFilesToDownload);
  });
});
