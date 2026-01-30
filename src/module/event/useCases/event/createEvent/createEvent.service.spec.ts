import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { Test, TestingModule } from '@nestjs/testing';
import { addDays } from 'date-fns';

import CreateEventErrors from './createEvent.error';
import { CreateEventService } from './createEvent.service';
import { CreateEventDTO } from './dto/createEvent.dto';

import { CreatePaymentService } from '@/module/billing/useCases/payment/createPayment/createPayment.service';
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

const makePayload = (overrides?: Partial<CreateEventDTO>): CreateEventDTO => {
  return {
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    slug: faker.string.uuid(),
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
        {
          provide: CreatePaymentService,
          useValue: {
            /**@todo: create a instance of the create payment service and create tests scenes for the payment service */
            execute: jest.fn().mockResolvedValue(null),
          },
        },
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
    const payload = makePayload();

    const event = fakeEvent(payload);

    eventRepoMock.save.mockResolvedValueOnce(event);

    const spyAccessService = jest.spyOn(addAccessToEvent, 'execute');

    const result = await service.execute(payload);

    expect(eventRepoMock.save).toHaveBeenCalled();
    expect(result.userId.toValue()).toEqual(event.userId.toValue());
    expect(result.slug.value).toEqual(event.slug.value);
    expect(spyAccessService).toHaveBeenCalled();
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

  it('should throw an error if the event days range is greater than the maximum allowed', async () => {
    const payload = makePayload({ startAt: new Date(), endAt: addDays(new Date(), 8) });

    await expect(service.execute(payload)).rejects.toThrow(CreateEventErrors.InvalidEventDaysRange);

    expect(eventRepoMock.save).not.toHaveBeenCalled();
  });
});
