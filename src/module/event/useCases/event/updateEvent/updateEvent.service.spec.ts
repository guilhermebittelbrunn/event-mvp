import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { Test, TestingModule } from '@nestjs/testing';

import UpdateEventErrors from './updateEvent.error';
import { UpdateEventService } from './updateEvent.service';

import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent';
import { IEventRepositorySymbol } from '@/module/event/repositories/event.repository.interface';
import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { FakeEventRepository } from '@/module/event/repositories/tests/repositories/fakeEvent.repository';
import { ReplaceFileService } from '@/module/shared/domain/file/services/replaceFile/replaceFile.service';
import { fakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { FakeFileRepository } from '@/module/shared/repositories/tests/repositories/fakeFile.repository';
import { FakeFileStoreService } from '@/shared/test/services';
import { EventStatusEnum } from '@/shared/types/event/event';

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

describe('UpdateEventService', () => {
  let service: UpdateEventService;
  let replaceFileService: ReplaceFileService;

  const eventRepoMock = new FakeEventRepository();

  const fileRepoMock = new FakeFileRepository();
  const fileStoreServiceMock = new FakeFileStoreService();

  replaceFileService = new ReplaceFileService(fileRepoMock, fileStoreServiceMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEventService,
        {
          provide: IEventRepositorySymbol,
          useValue: eventRepoMock,
        },
        {
          provide: ReplaceFileService,
          useValue: replaceFileService,
        },
        AddAccessToEvent,
      ],
    }).compile();

    service = module.get<UpdateEventService>(UpdateEventService);
    replaceFileService = module.get<ReplaceFileService>(ReplaceFileService);

    fileRepoMock.create.mockResolvedValueOnce(fakeFile());

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a event successfully', async () => {
    const event = fakeEvent();

    eventRepoMock.findCompleteById.mockResolvedValueOnce(event);
    eventRepoMock.update.mockResolvedValueOnce(event.id.toValue());

    const spyReplaceFileService = jest.spyOn(replaceFileService, 'execute');

    const result = await service.execute({
      id: event.id.toValue(),
      name: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      slug: faker.lorem.words(3),
      image: makeFile(),
    });

    expect(result).toBe(event.id.toValue());
    expect(eventRepoMock.update).toHaveBeenCalled();
    expect(spyReplaceFileService).toHaveBeenCalled();
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
