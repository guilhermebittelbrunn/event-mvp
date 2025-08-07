import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import { DeleteMemoryService } from './deleteMemory.service';

import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { FakeMemoryRepository } from '@/module/event/repositories/tests/repositories/fakeMemory.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';

describe('DeleteMemoryService', () => {
  let service: DeleteMemoryService;

  const memoryRepoMock = new FakeMemoryRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMemoryService,
        {
          provide: IMemoryRepositorySymbol,
          useValue: memoryRepoMock,
        },
      ],
    }).compile();

    service = module.get<DeleteMemoryService>(DeleteMemoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a memory successfully', async () => {
    const memory = fakeMemory();

    memoryRepoMock.delete.mockResolvedValueOnce(true);

    const result = await service.execute(memory.id.toValue());

    expect(result).toBeUndefined();
    expect(memoryRepoMock.delete).toHaveBeenCalled();
  });

  it('should throw a not found error if memory does not exist', async () => {
    memoryRepoMock.delete.mockResolvedValueOnce(false);

    await expect(service.execute(faker.string.uuid())).rejects.toThrow(GenericErrors.NotFound);
  });
});
