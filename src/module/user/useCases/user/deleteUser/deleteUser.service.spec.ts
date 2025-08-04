import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';

import { DeleteUserService } from './deleteUser.service';

import { fakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { FakeUserRepository } from '@/module/user/repositories/tests/repositories/fakeUser.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  const userRepoMock = new FakeUserRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: IUserRepositorySymbol,
          useValue: userRepoMock,
        },
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a user successfully', async () => {
    const user = fakeUser();

    userRepoMock.delete.mockResolvedValueOnce(true);

    const result = await service.execute(user.id.toValue());

    expect(result).toBeUndefined();
    expect(userRepoMock.delete).toHaveBeenCalled();
  });

  it('should throw a not found error if user does not exist', async () => {
    userRepoMock.delete.mockResolvedValueOnce(false);

    await expect(service.execute(faker.string.uuid())).rejects.toThrow(GenericErrors.NotFound);
  });
});
