import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { RefreshService } from './refresh.service';

import { fakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { FakeUserRepository } from '@/module/user/repositories/tests/repositories/fakeUser.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';
import { FakeConfigService } from '@/shared/test/services';
import { FakeJwtService } from '@/shared/test/services/fakeJwtService';

describe('RefreshService', () => {
  let service: RefreshService;

  const userRepoMock = new FakeUserRepository();
  const jwtServiceMock = new FakeJwtService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshService,
        {
          provide: IUserRepositorySymbol,
          useValue: userRepoMock,
        },
        {
          provide: IJwtServiceSymbol,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: new FakeConfigService(),
        },
      ],
    }).compile();

    service = module.get<RefreshService>(RefreshService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should refresh a user successfully', async () => {
    const user = fakeUser();

    userRepoMock.findById.mockResolvedValueOnce(user);

    jwtServiceMock.generateTokens.mockResolvedValueOnce({
      accessToken: 'mock.jwt.token',
      refreshToken: 'mock.jwt.token',
    });

    const result = await service.execute(user.id.toValue());

    expect(result).toEqual({ user, tokens: { accessToken: 'mock.jwt.token', refreshToken: 'mock.jwt.token' } });
  });

  it('should throw a not found error if user does not exist', async () => {
    userRepoMock.findById.mockResolvedValueOnce(null);

    await expect(service.execute(faker.string.uuid())).rejects.toThrow(GenericErrors.NotFound);
  });
});
