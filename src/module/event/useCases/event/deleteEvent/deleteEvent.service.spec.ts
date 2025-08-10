import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import { DeleteEventService } from './deleteEvent.service';

import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { FakeEventRepository } from '@/module/event/repositories/tests/repositories/fakeEvent.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { EventStatusEnum } from '@/shared/types/event/event';

describe('DeleteEventService', () => {
  let service: DeleteEventService;

  const eventRepoMock = new FakeEventRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteEventService,
        {
          provide: IEventRepositorySymbol,
          useValue: eventRepoMock,
        },
      ],
    }).compile();

    service = module.get<DeleteEventService>(DeleteEventService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete an event successfully', async () => {
    const event = fakeEvent();

    eventRepoMock.findById.mockResolvedValueOnce(event);
    eventRepoMock.delete.mockResolvedValueOnce(true);

    const result = await service.execute(event.id.toValue());

    expect(result).toBeUndefined();
    expect(eventRepoMock.delete).toHaveBeenCalled();
    expect(eventRepoMock.findById).toHaveBeenCalledWith(event.id.toValue());
  });

  it('should throw a event in progress error if event is in progress', async () => {
    const event = fakeEvent({ status: EventStatusEnum.IN_PROGRESS });

    eventRepoMock.findById.mockResolvedValueOnce(event);

    await expect(service.execute(event.id.toValue())).rejects.toThrow(GenericErrors.InvalidParam);

    expect(eventRepoMock.delete).not.toHaveBeenCalled();
    expect(eventRepoMock.findById).toHaveBeenCalledWith(event.id.toValue());
  });

  it('should throw a not found error if event does not exist', async () => {
    eventRepoMock.findById.mockResolvedValueOnce(null);

    await expect(service.execute(faker.string.uuid())).rejects.toThrow(GenericErrors.NotFound);

    expect(eventRepoMock.delete).not.toHaveBeenCalled();
    expect(eventRepoMock.findById).toHaveBeenCalled();
  });
});
