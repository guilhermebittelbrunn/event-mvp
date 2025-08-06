import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { SignInByTokenService } from './signInByToken.service';

import { ValidateEventAccess } from '@/module/event/domain/event/services/validateEventAccess/validateEventAccess.service';
import { IEventAccessRepositorySymbol } from '@/module/event/repositories/eventAccess.repository.interface';
import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { fakeEventAccess } from '@/module/event/repositories/tests/entities/fakeEventAccess';
import { FakeEventRepository } from '@/module/event/repositories/tests/repositories/fakeEvent.repository';
import { FakeEventAccessRepository } from '@/module/event/repositories/tests/repositories/fakeEventAccess.repository';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';
import { FakeAlsService, FakeConfigService } from '@/shared/test/services';
import { FakeJwtService } from '@/shared/test/services/fakeJwtService';
import { EventStatusEnum } from '@/shared/types/user/event';

describe('SignInByTokenService', () => {
  let service: SignInByTokenService;

  const jwtServiceMock = new FakeJwtService();
  const eventAccessRepoMock = new FakeEventAccessRepository();
  const eventRepoMock = new FakeEventRepository();
  const alsMock = new FakeAlsService();

  const validateEventAccessMock = new ValidateEventAccess(alsMock, eventRepoMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInByTokenService,
        {
          provide: IEventAccessRepositorySymbol,
          useValue: eventAccessRepoMock,
        },
        {
          provide: IJwtServiceSymbol,
          useValue: jwtServiceMock,
        },
        {
          provide: ValidateEventAccess,
          useValue: validateEventAccessMock,
        },
        {
          provide: ConfigService,
          useValue: new FakeConfigService(),
        },
      ],
    }).compile();

    service = module.get<SignInByTokenService>(SignInByTokenService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign in a event by token successfully', async () => {
    const eventAccess = fakeEventAccess();
    const event = fakeEvent({ status: EventStatusEnum.IN_PROGRESS });
    const eightHoursInMs = 8 * 60 * 60 * 1000;

    const mockEndAt = new Date();
    const mockEvent = {
      ...event,
      endAt: mockEndAt,
    };

    eventAccessRepoMock.findById.mockResolvedValueOnce(eventAccess);
    eventRepoMock.findById.mockResolvedValueOnce(event);
    validateEventAccessMock.execute = jest.fn().mockResolvedValueOnce(mockEvent);

    jwtServiceMock.generateEventToken.mockResolvedValueOnce({
      access_token: 'mock.jwt.token',
      expires_in: 3600000,
      expires_at: mockEndAt.getTime() + eightHoursInMs,
    });

    const result = await service.execute({ token: eventAccess.id.toValue() });

    expect(result).toEqual({
      event: mockEvent,
      token: {
        access_token: 'mock.jwt.token',
        expires_in: 3600000,
        expires_at: mockEndAt.getTime() + eightHoursInMs,
      },
    });
  });

  it('should throw a not found error if event access does not exist', async () => {
    eventAccessRepoMock.findById.mockResolvedValueOnce(null);

    await expect(service.execute({ token: faker.string.uuid() })).rejects.toThrow(GenericErrors.NotAuthorized);
  });

  it('should throw a not authorized error if validate event access fails', async () => {
    const eventAccess = fakeEventAccess();

    eventAccessRepoMock.findById.mockResolvedValueOnce(eventAccess);
    validateEventAccessMock.execute = jest.fn().mockResolvedValueOnce(null);

    await expect(service.execute({ token: eventAccess.id.toValue() })).rejects.toThrow(
      GenericErrors.NotAuthorized,
    );

    expect(validateEventAccessMock.execute).toHaveBeenCalledWith(eventAccess.eventId.toValue());
  });
});
