import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import DeleteBulkMemoryErrors from './deleteBulkMemory.error';
import { DeleteBulkMemoryService } from './deleteBulkMemory.service';

import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { FakeMemoryRepository } from '@/module/event/repositories/tests/repositories/fakeMemory.repository';
import { IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import { fakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { FakeFileRepository } from '@/module/shared/repositories/tests/repositories/fakeFile.repository';
import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { FakeFileStoreService } from '@/shared/test/services';

describe('DeleteBulkMemoryService', () => {
  let service: DeleteBulkMemoryService;

  const memoryRepoMock = new FakeMemoryRepository();
  const fileRepoMock = new FakeFileRepository();
  const fileStoreServiceMock = new FakeFileStoreService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBulkMemoryService,
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
      ],
    }).compile();

    service = module.get<DeleteBulkMemoryService>(DeleteBulkMemoryService);

    fileRepoMock.create.mockResolvedValueOnce(fakeFile());
    fileStoreServiceMock.upload.mockResolvedValueOnce(faker.internet.url());
    memoryRepoMock.deleteBulk.mockResolvedValueOnce(true);
    fileRepoMock.deleteBulk.mockResolvedValueOnce(true);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a memory successfully', async () => {
    const memory = fakeMemory();

    memoryRepoMock.findAllByIds.mockResolvedValueOnce([memory]);

    await service.execute({ memoryIds: [memory.id.toValue()] });

    expect(memoryRepoMock.findAllByIds).toHaveBeenCalled();

    expect(memoryRepoMock.deleteBulk).toHaveBeenCalled();
  });

  it('should delete multiple memories successfully', async () => {
    const memory1 = fakeMemory({ fileId: fakeFile().id.toValue() });
    const memory2 = fakeMemory({ fileId: fakeFile().id.toValue() });

    const memories = [memory1, memory2];

    const file1 = fakeFile({ id: memory1.fileId?.toValue() });
    const file2 = fakeFile({ id: memory2.fileId?.toValue() });

    memory1.file = file1;
    memory2.file = file2;

    const files = [file1, file2];

    memoryRepoMock.findAllByIds.mockResolvedValueOnce(memories);

    await service.execute({ memoryIds: memories.map(({ id }) => id.toValue()) });

    expect(memoryRepoMock.findAllByIds).toHaveBeenCalled();
    expect(fileStoreServiceMock.deleteBulk).toHaveBeenCalled();
    expect(memoryRepoMock.deleteBulk).toHaveBeenCalledWith(memories.map(({ id }) => id.toValue()));
    expect(fileRepoMock.deleteBulk).toHaveBeenCalledWith(files.map(({ id }) => id));
    expect(fileStoreServiceMock.deleteBulk).toHaveBeenCalledWith(files.map(({ path }) => path));
  });

  it('should throw an error if the max memory ids to delete is exceeded', async () => {
    const memoriesIds = Array.from({ length: 31 }, () => faker.string.uuid());

    await expect(service.execute({ memoryIds: memoriesIds })).rejects.toThrow(
      DeleteBulkMemoryErrors.MaxMemoryIdsToDeleteExceeded,
    );

    expect(memoryRepoMock.findAllByIds).not.toHaveBeenCalled();
    expect(fileStoreServiceMock.deleteBulk).not.toHaveBeenCalled();
    expect(memoryRepoMock.deleteBulk).not.toHaveBeenCalled();
  });

  it('should throw an error if the memory is not found', async () => {
    const memory1 = fakeMemory();
    const memory2 = fakeMemory();

    const memoryIds = [memory1.id.toValue(), memory2.id.toValue()];

    memoryRepoMock.findAllByIds.mockResolvedValueOnce([memory1]);

    await expect(service.execute({ memoryIds })).rejects.toThrow(DeleteBulkMemoryErrors.MemoriesNotFound);

    expect(memoryRepoMock.findAllByIds).toHaveBeenCalled();
    expect(fileStoreServiceMock.deleteBulk).not.toHaveBeenCalled();
    expect(memoryRepoMock.deleteBulk).not.toHaveBeenCalled();
  });
});
