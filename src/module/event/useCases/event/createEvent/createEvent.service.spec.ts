import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { Test, TestingModule } from '@nestjs/testing';

import CreateEventErrors from './createEvent.error';
import { CreateEventService } from './createEvent.service';
import { CreateEventDTO } from './dto/createEvent.dto';

import EventSlug from '@/module/event/domain/event/eventSlug';
import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent.service';
import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { FakeEventRepository } from '@/module/event/repositories/tests/repositories/fakeEvent.repository';
import { AddFileService } from '@/module/shared/domain/file/services/addFile/addFile.service';
import { BuildPathService } from '@/module/shared/domain/file/services/buildPath/buildPath';
import { fakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { FakeFileRepository } from '@/module/shared/repositories/tests/repositories/fakeFile.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { FakeFileStoreService } from '@/shared/test/services';
import { EventStatusEnum } from '@/shared/types/event/event';

const makePayload = (overrides?: Partial<CreateEventDTO>): CreateEventDTO => {
  return {
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    slug: faker.string.uuid(),
    status: EventStatusEnum.DRAFT,
    startAt: new Date(),
    endAt: new Date(),
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

describe('CreateEventService', () => {
  let service: CreateEventService;
  let addAccessToEvent: AddAccessToEvent;

  const eventRepoMock = new FakeEventRepository();
  const fileRepoMock = new FakeFileRepository();
  const fileStoreServiceMock = new FakeFileStoreService();
  const buildPathServiceMock = new BuildPathService();

  const addFileService = new AddFileService(fileRepoMock, fileStoreServiceMock, buildPathServiceMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEventService,
        {
          provide: IEventRepositorySymbol,
          useValue: eventRepoMock,
        },
        {
          provide: AddFileService,
          useValue: addFileService,
        },
        AddAccessToEvent,
      ],
    }).compile();

    eventRepoMock.findBySlug.mockResolvedValue(null);

    service = module.get<CreateEventService>(CreateEventService);
    addAccessToEvent = module.get<AddAccessToEvent>(AddAccessToEvent);

    fileRepoMock.create.mockResolvedValue(fakeFile());

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a event successfully', async () => {
    const payload = makePayload({ status: EventStatusEnum.COMPLETED });

    const event = fakeEvent(payload);

    eventRepoMock.save.mockResolvedValueOnce(event);

    const spyAccessService = jest.spyOn(addAccessToEvent, 'execute');

    const result = await service.execute(payload);

    expect(eventRepoMock.save).toHaveBeenCalled();
    expect(result.userId.toValue()).toEqual(event.userId.toValue());
    expect(result.slug.value).toEqual(event.slug.value);
    expect(result.status.value).toEqual(event.status.value);
    expect(result.status.value).toEqual(EventStatusEnum.COMPLETED);
    expect(spyAccessService).toHaveBeenCalled();
  });

  it('should throw an error if the event status is not valid', async () => {
    const payload = makePayload({ status: 'invalid' as EventStatusEnum });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(eventRepoMock.save).not.toHaveBeenCalled();
  });

  it('should throw an error if the event slug is not valid', async () => {
    const payload = makePayload({ slug: '-invalid' });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(eventRepoMock.save).not.toHaveBeenCalled();
  });

  it('should throw an error if the event startAt is not valid', async () => {
    const payload = makePayload({ startAt: null });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);

    expect(eventRepoMock.save).not.toHaveBeenCalled();
  });

  it('should throw an error if the event slug is already in use', async () => {
    const payload = makePayload({ slug: 'existing-slug' });

    eventRepoMock.findBySlug.mockResolvedValueOnce(fakeEvent(payload));

    await expect(service.execute(payload)).rejects.toThrow(CreateEventErrors.SlugAlreadyInUse);

    expect(eventRepoMock.findBySlug).toHaveBeenCalledWith(EventSlug.create(payload.slug));
    expect(eventRepoMock.save).not.toHaveBeenCalled();
  });
});
