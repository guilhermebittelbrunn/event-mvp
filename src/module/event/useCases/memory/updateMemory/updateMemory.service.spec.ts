import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import { UpdateMemoryService } from './updateMemory.service';

import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { FakeMemoryRepository } from '@/module/event/repositories/tests/repositories/fakeMemory.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';

describe('UpdateMemoryService', () => {
  let service: UpdateMemoryService;

  const memoryRepoMock = new FakeMemoryRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMemoryService,
        {
          provide: IMemoryRepositorySymbol,
          useValue: memoryRepoMock,
        },
      ],
    }).compile();

    service = module.get<UpdateMemoryService>(UpdateMemoryService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a event successfully', async () => {
    const memory = fakeMemory();

    memoryRepoMock.findById.mockResolvedValueOnce(memory);
    memoryRepoMock.update.mockResolvedValueOnce(memory.id.toValue());

    const result = await service.execute({
      id: memory.id.toValue(),
      message: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      identifier: faker.lorem.words(3),
    });

    expect(result).toBe(memory.id.toValue());
    expect(memoryRepoMock.update).toHaveBeenCalled();
  });

  it('should throw a not found error if memory does not exist', async () => {
    await expect(
      service.execute({
        id: faker.string.uuid(),
      }),
    ).rejects.toThrow(GenericErrors.NotFound);
  });
});
