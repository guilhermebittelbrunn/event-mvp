import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import CreateEventErrors from './createEvent.error';
import { CreateEventService } from './createEvent.service';
import { CreateEventDTO } from './dto/createEvent.dto';

import EventSlug from '@/module/event/domain/event/eventSlug';
import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { FakeEventRepository } from '@/module/event/repositories/tests/repositories/fakeEvent.repository';
import GenericErrors from '@/shared/core/logic/GenericErrors';
import { EventStatusEnum } from '@/shared/types/user/event';

const makePayload = (overrides?: Partial<CreateEventDTO>): CreateEventDTO => {
  return {
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    slug: faker.string.uuid(),
    status: EventStatusEnum.DRAFT,
    start_at: new Date(),
    end_at: new Date(),
    ...overrides,
  };
};

describe('CreateEventService', () => {
  let service: CreateEventService;

  const eventRepoMock = new FakeEventRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEventService,
        {
          provide: IEventRepositorySymbol,
          useValue: eventRepoMock,
        },
      ],
    }).compile();

    eventRepoMock.findBySlug.mockResolvedValue(null);

    service = module.get<CreateEventService>(CreateEventService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a event successfully', async () => {
    const payload = makePayload({ status: EventStatusEnum.COMPLETED });

    const event = fakeEvent(payload);

    eventRepoMock.create.mockResolvedValueOnce(event);

    const result = await service.execute(payload);

    expect(eventRepoMock.create).toHaveBeenCalled();
    expect(result.userId.toValue()).toEqual(event.userId.toValue());
    expect(result.slug.value).toEqual(event.slug.value);
    expect(result.status.value).toEqual(event.status.value);
    expect(result.status.value).toEqual(EventStatusEnum.COMPLETED);
  });

  it('should throw an error if the event status is not valid', async () => {
    const payload = makePayload({ status: 'invalid' as EventStatusEnum });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(eventRepoMock.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the event slug is not valid', async () => {
    const payload = makePayload({ slug: '-invalid' });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(eventRepoMock.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the event start_at is not valid', async () => {
    const payload = makePayload({ start_at: null });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(eventRepoMock.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the event slug is already in use', async () => {
    const payload = makePayload({ slug: 'existing-slug' });

    eventRepoMock.findBySlug.mockResolvedValueOnce(fakeEvent(payload));

    await expect(service.execute(payload)).rejects.toThrow(CreateEventErrors.SlugAlreadyInUse);

    expect(eventRepoMock.findBySlug).toHaveBeenCalledWith(EventSlug.create(payload.slug));
    expect(eventRepoMock.create).not.toHaveBeenCalled();
  });
});
