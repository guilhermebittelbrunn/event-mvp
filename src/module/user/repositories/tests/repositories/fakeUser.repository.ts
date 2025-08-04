import User from '@/module/user/domain/user/user';
import { IUserRepository } from '@/module/user/repositories/user.repository.interface';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakeUserRepository extends FakeBaseRepository<User> implements IUserRepository {
  list = jest.fn();
  findByEmail = jest.fn();
}
