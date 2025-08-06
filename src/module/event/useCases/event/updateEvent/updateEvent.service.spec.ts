import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import UpdateEventErrors from './updateEvent.error';
import { UpdateEventService } from './updateEvent.service';

import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent';
import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { FakeEventRepository } from '@/module/event/repositories/tests/repositories/fakeEvent.repository';
import { EventStatusEnum } from '@/shared/types/user/event';

describe('UpdateEventService', () => {
  let service: UpdateEventService;
  let addAccessToEvent: AddAccessToEvent;

  const eventRepoMock = new FakeEventRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEventService,
        {
          provide: IEventRepositorySymbol,
          useValue: eventRepoMock,
        },
        AddAccessToEvent,
      ],
    }).compile();

    service = module.get<UpdateEventService>(UpdateEventService);
    addAccessToEvent = module.get<AddAccessToEvent>(AddAccessToEvent);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a event successfully', async () => {
    const event = fakeEvent();

    eventRepoMock.findCompleteById.mockResolvedValueOnce(event);
    eventRepoMock.update.mockResolvedValueOnce(event.id.toValue());

    const spyAccessService = jest.spyOn(addAccessToEvent, 'execute');

    const result = await service.execute({
      id: event.id.toValue(),
      name: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      slug: faker.lorem.words(3),
    });

    expect(result).toBe(event.id.toValue());
    expect(eventRepoMock.update).toHaveBeenCalled();
    expect(spyAccessService).toHaveBeenCalled();
  });

  it('should throw a not found error if event does not exist', async () => {
    await expect(
      service.execute({
        id: faker.string.uuid(),
      }),
    ).rejects.toThrow(UpdateEventErrors.NotFoundError);
  });

  it('should throw a invalid param error if event is in progress or completed', async () => {
    const event = fakeEvent({ status: EventStatusEnum.IN_PROGRESS });

    eventRepoMock.findCompleteById.mockResolvedValueOnce(event);

    await expect(service.execute({ id: event.id.toValue() })).rejects.toThrow(UpdateEventErrors.InvalidParam);

    expect(eventRepoMock.findCompleteById).toHaveBeenCalled();
    expect(eventRepoMock.update).not.toHaveBeenCalled();
  });

  it('should throw a slug already in use error if event slug is already in use', async () => {
    const event = fakeEvent();

    eventRepoMock.findCompleteById.mockResolvedValueOnce(event);
    eventRepoMock.findBySlug.mockResolvedValueOnce(event);

    await expect(service.execute({ id: event.id.toValue(), slug: event.slug.value })).rejects.toThrow(
      UpdateEventErrors.SlugAlreadyInUse,
    );

    expect(eventRepoMock.findCompleteById).toHaveBeenCalled();
    expect(eventRepoMock.findBySlug).toHaveBeenCalled();
    expect(eventRepoMock.update).not.toHaveBeenCalled();
  });
});
