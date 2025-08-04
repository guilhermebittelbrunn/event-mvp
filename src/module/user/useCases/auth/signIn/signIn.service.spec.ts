import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import SignInErrors from './signIn.error';
import { SignInService } from './signIn.service';

import { fakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { FakeUserRepository } from '@/module/user/repositories/tests/repositories/fakeUser.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';
import { FakeConfigService } from '@/shared/test/services';
import { FakeJwtService } from '@/shared/test/services/fakeJwtService';

describe('SignInService', () => {
  let service: SignInService;

  const userRepoMock = new FakeUserRepository();
  const jwtServiceMock = new FakeJwtService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInService,
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

    service = module.get<SignInService>(SignInService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign in a user successfully', async () => {
    const user = fakeUser();

    userRepoMock.findByEmail.mockResolvedValueOnce(user);

    jwtServiceMock.generateTokens.mockResolvedValueOnce({
      accessToken: 'mock.jwt.token',
      refreshToken: 'mock.jwt.token',
    });

    const result = await service.execute({
      email: user.email.value,
      password: user.password.value,
    });

    expect(result).toEqual({ user, tokens: { accessToken: 'mock.jwt.token', refreshToken: 'mock.jwt.token' } });
  });

  it('should throw a not found error if user does not exist', async () => {
    await expect(
      service.execute({
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    ).rejects.toThrow(SignInErrors.NotFoundError);
  });
});
