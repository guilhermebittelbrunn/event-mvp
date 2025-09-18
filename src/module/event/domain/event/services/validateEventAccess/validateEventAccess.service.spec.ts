import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { ValidateEventAccess } from './validateEventAccess.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { FakeEventRepository } from '@/module/event/repositories/tests/repositories/fakeEvent.repository';
import { Als } from '@/shared/services/als/als.interface';
import { FakeAlsService } from '@/shared/test/services';
import { EventStatusEnum } from '@/shared/types/event/event';

describe('ValidateEventAccessService', () => {
  let service: ValidateEventAccess;
  let als: Als;

  const eventRepoMock = new FakeEventRepository();
  const alsMock = new FakeAlsService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateEventAccess,
        {
          provide: IEventRepositorySymbol,
          useValue: eventRepoMock,
        },
        {
          provide: Als,
          useValue: alsMock,
        },
      ],
    }).compile();

    eventRepoMock.findBySlug.mockResolvedValue(null);

    service = module.get<ValidateEventAccess>(ValidateEventAccess);
    als = module.get<Als>(Als);

    alsMock.getStore.mockReturnValue({ event: null });

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a event successfully', async () => {
    const event = fakeEvent({ status: EventStatusEnum.IN_PROGRESS });

    eventRepoMock.findCompleteById.mockResolvedValueOnce(event);

    const result = await service.execute(event.id.toValue());

    expect(eventRepoMock.findCompleteById).toHaveBeenCalledWith(event.id.toValue());
    expect(result).toBe(event);
    expect(als.getStore().event).toBe(event);
  });

  it('should return null if eventId is not provided', async () => {
    const result = await service.execute();

    expect(eventRepoMock.findCompleteById).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null if event is not found', async () => {
    const id = faker.string.uuid();

    eventRepoMock.findCompleteById.mockResolvedValueOnce(null);
    const result = await service.execute(id);

    expect(eventRepoMock.findCompleteById).toHaveBeenCalledWith(id);
    expect(result).toBeNull();
  });

  it('should return null if end date event is in the past', async () => {
    const event = fakeEvent({ endAt: new Date(Date.now() - 1000) });

    eventRepoMock.findCompleteById.mockResolvedValueOnce(event);

    const result = await service.execute(event.id.toValue());

    expect(eventRepoMock.findCompleteById).toHaveBeenCalledWith(event.id.toValue());
    expect(result).toBeNull();
  });

  it('should return null if event is not in progress or published', async () => {
    const event = fakeEvent({ status: EventStatusEnum.DRAFT });

    eventRepoMock.findCompleteById.mockResolvedValueOnce(event);

    const result = await service.execute(event.id.toValue());

    expect(eventRepoMock.findCompleteById).toHaveBeenCalledWith(event.id.toValue());
    expect(result).toBeNull();
  });
});
