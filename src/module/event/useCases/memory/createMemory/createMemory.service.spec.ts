import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateMemoryService } from './createMemory.service';
import { CreateMemoryDTO } from './dto/createMemory.dto';

import { IMemoryRepositorySymbol } from '@/module/event/repositories/memory.repository.interface';
import { fakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { FakeMemoryRepository } from '@/module/event/repositories/tests/repositories/fakeMemory.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';

const makePayload = (overrides?: Partial<CreateMemoryDTO>): CreateMemoryDTO => {
  return {
    eventId: faker.string.uuid(),
    ipAddress: faker.internet.ip(),
    identifier: faker.string.uuid(),
    description: faker.lorem.sentence(),
    message: faker.lorem.sentence(),
    ...overrides,
  };
};

describe('CreateMemoryService', () => {
  let service: CreateMemoryService;

  const memoryRepoMock = new FakeMemoryRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMemoryService,
        {
          provide: IMemoryRepositorySymbol,
          useValue: memoryRepoMock,
        },
      ],
    }).compile();

    service = module.get<CreateMemoryService>(CreateMemoryService);

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
    expect(result.id.toValue()).toEqual(memory.id.toValue());
    expect(result.eventId.toValue()).toEqual(memory.eventId.toValue());
    expect(result.ipAddress.value).toEqual(memory.ipAddress.value);
    expect(result.identifier).toEqual(memory.identifier);
    expect(result.description).toEqual(memory.description);
    expect(result.message).toEqual(memory.message);
  });

  it('should throw an error if the ip address is not valid', async () => {
    const payload = makePayload({ ipAddress: 'invalid' });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(memoryRepoMock.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the event id is not valid', async () => {
    const payload = makePayload({ eventId: 'invalid' });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(memoryRepoMock.create).not.toHaveBeenCalled();
  });
});
