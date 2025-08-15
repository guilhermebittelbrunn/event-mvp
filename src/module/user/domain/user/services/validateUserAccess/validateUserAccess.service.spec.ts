import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { ValidateUserAccess } from './validateUserAccess.service';

import { fakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { FakeUserRepository } from '@/module/user/repositories/tests/repositories/fakeUser.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { Als } from '@/shared/services/als/als.interface';
import { FakeAlsService } from '@/shared/test/services';

describe('ValidateUserAccessService', () => {
  let service: ValidateUserAccess;
  let als: Als;

  const userRepoMock = new FakeUserRepository();
  const alsMock = new FakeAlsService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserAccess,
        {
          provide: IUserRepositorySymbol,
          useValue: userRepoMock,
        },
        {
          provide: Als,
          useValue: alsMock,
        },
      ],
    }).compile();

    userRepoMock.findById.mockResolvedValue(null);

    service = module.get<ValidateUserAccess>(ValidateUserAccess);
    als = module.get<Als>(Als);

    alsMock.getStore.mockReturnValue({ user: null });

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user successfully', async () => {
    const user = fakeUser();

    userRepoMock.findById.mockResolvedValueOnce(user);

    const result = await service.validate(user.id.toValue());

    expect(userRepoMock.findById).toHaveBeenCalledWith(user.id.toValue());
    expect(result).toBe(user);
    expect(als.getStore().user).toBe(user);
  });

  it('should return null if userId is not provided', async () => {
    const result = await service.validate();

    expect(userRepoMock.findById).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null if user is not found', async () => {
    const id = faker.string.uuid();

    userRepoMock.findById.mockResolvedValueOnce(null);
    const result = await service.validate(id);

    expect(userRepoMock.findById).toHaveBeenCalledWith(id);
    expect(result).toBeNull();
  });
});
