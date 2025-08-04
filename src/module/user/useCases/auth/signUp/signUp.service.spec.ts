import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import SignUpErrors from './signUp.error';
import { SignUpService } from './signUp.service';

import { fakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { FakeUserRepository } from '@/module/user/repositories/tests/repositories/fakeUser.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';
import { FakeJwtService } from '@/shared/test/services/fakeJwtService';

describe('SignUpService', () => {
  let service: SignUpService;

  const userRepoMock = new FakeUserRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpService,
        {
          provide: IUserRepositorySymbol,
          useValue: userRepoMock,
        },
        {
          provide: IJwtServiceSymbol,
          useValue: new FakeJwtService(),
        },
      ],
    }).compile();

    service = module.get<SignUpService>(SignUpService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user successfully', async () => {
    const user = fakeUser();

    userRepoMock.findByEmail.mockResolvedValueOnce(null);
    userRepoMock.create.mockResolvedValueOnce(user);

    const result = await service.execute({
      name: user.name,
      email: user.email.value,
      password: user.password.value,
      type: user.type.value,
    });

    expect(result).toBe(user);
    expect(userRepoMock.findByEmail).toHaveBeenCalledWith(user.email.value);
    expect(userRepoMock.create).toHaveBeenCalled();
  });

  it('should throw a conflict error if user with same email already exists', async () => {
    const existingUser = fakeUser();

    userRepoMock.findByEmail.mockResolvedValueOnce(existingUser);

    await expect(
      service.execute({
        name: faker.person.fullName(),
        email: existingUser.email.value,
        password: faker.internet.password(),
        type: existingUser.type.value,
      }),
    ).rejects.toThrow(SignUpErrors.EmailAlreadyInUse);

    expect(userRepoMock.findByEmail).toHaveBeenCalledWith(existingUser.email.value);
    expect(userRepoMock.create).not.toHaveBeenCalled();
  });
});
