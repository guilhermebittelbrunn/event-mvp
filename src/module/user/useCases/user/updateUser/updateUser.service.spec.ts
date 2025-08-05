import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import UpdateUserErrors from './updateUser.error';
import { UpdateUserService } from './updateUser.service';

import { fakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { FakeUserRepository } from '@/module/user/repositories/tests/repositories/fakeUser.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  const userRepoMock = new FakeUserRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: IUserRepositorySymbol,
          useValue: userRepoMock,
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a user successfully', async () => {
    const user = fakeUser();

    userRepoMock.findById.mockResolvedValueOnce(user);
    userRepoMock.update.mockResolvedValueOnce(user.id.toValue());

    const result = await service.execute({
      id: user.id.toValue(),
      name: faker.person.fullName(),
    });

    expect(result).toBe(user.id.toValue());
    expect(userRepoMock.update).toHaveBeenCalled();
  });

  it('should throw a not found error if user does not exist', async () => {
    await expect(
      service.execute({
        id: faker.string.uuid(),
      }),
    ).rejects.toThrow(UpdateUserErrors.NotFoundError);
  });

  it('should throw a conflict error if new email is already in use', async () => {
    const existingUser = fakeUser();
    const conflictingUser = fakeUser();
    const existingEmail = faker.internet.email();

    userRepoMock.findById.mockResolvedValueOnce(existingUser);
    userRepoMock.findByEmail.mockResolvedValueOnce(conflictingUser);

    await expect(
      service.execute({
        id: existingUser.id.toValue(),
        email: existingEmail,
      }),
    ).rejects.toThrow(UpdateUserErrors.EmailAlreadyInUse);

    expect(userRepoMock.findByEmail).toHaveBeenCalledWith(existingEmail);
    expect(userRepoMock.update).not.toHaveBeenCalled();
  });
});
