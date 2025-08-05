import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import { UpdateEventConfigService } from './updateEventConfig.service';

import { IEventConfigRepositorySymbol } from '@/module/event/repositories/eventConfig.repository.interface';
import { fakeEventConfig } from '@/module/event/repositories/tests/entities/fakeEventConfig';
import { FakeEventConfigRepository } from '@/module/event/repositories/tests/repositories/fakeEventConfig.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';

describe('UpdateEventConfigService', () => {
  let service: UpdateEventConfigService;

  const eventConfigRepoMock = new FakeEventConfigRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEventConfigService,
        {
          provide: IEventConfigRepositorySymbol,
          useValue: eventConfigRepoMock,
        },
      ],
    }).compile();

    service = module.get<UpdateEventConfigService>(UpdateEventConfigService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a event config successfully', async () => {
    const eventConfig = fakeEventConfig();

    eventConfigRepoMock.findById.mockResolvedValueOnce(eventConfig);
    eventConfigRepoMock.update.mockResolvedValueOnce(eventConfig.id.toValue());

    const result = await service.execute({
      id: eventConfig.id.toValue(),
      eventId: eventConfig.eventId.toValue(),
      primaryColor: faker.color.rgb(),
      secondaryColor: faker.color.rgb(),
      primaryContrast: faker.color.rgb(),
      secondaryContrast: faker.color.rgb(),
      backgroundColor: faker.color.rgb(),
      backgroundContrast: faker.color.rgb(),
      textColorPrimary: faker.color.rgb(),
      textColorSecondary: faker.color.rgb(),
      welcomeMessage: faker.lorem.sentence(),
    });

    expect(result).toBe(eventConfig.id.toValue());
    expect(eventConfigRepoMock.update).toHaveBeenCalled();
  });

  it('should throw a not found error if event config does not exist', async () => {
    await expect(
      service.execute({
        id: faker.string.uuid(),
        eventId: faker.string.uuid(),
      }),
    ).rejects.toThrow(GenericErrors.NotFound);
  });
});
