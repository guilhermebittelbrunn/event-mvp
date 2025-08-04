import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { UserModel } from '@prisma/client';

import User from '@/module/user/domain/user/user';
import UserEmail from '@/module/user/domain/user/userEmail';
import UserPassword from '@/module/user/domain/user/userPassword';
import UserType from '@/module/user/domain/user/userType';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { UserTypeEnum } from '@/shared/types/user';

export function fakeUser(overrides?: Partial<UserModel>): User {
  const email = UserEmail.create(overrides?.email ?? faker.internet.email());
  const type = UserType.create((overrides?.type as UserTypeEnum) ?? UserTypeEnum.COMMON);

  const plainPassword = overrides?.password ?? faker.internet.password();

  const password = UserPassword.create({ value: plainPassword, hashed: false });

  return User.create(
    {
      name: faker.person.fullName(),
      ...overrides,
      email,
      password,
      type,
    },
    UniqueEntityID.create(),
  );
}

export async function insertFakeUser(overrides?: Partial<UserModel>): Promise<UserModel> {
  const user = fakeUser(overrides);

  const password = overrides?.password ?? faker.internet.password();
  const userPassword = UserPassword.create({ value: password, hashed: false });

  return prisma.userModel.create({
    data: {
      id: user.id.toValue(),
      name: user.name,
      email: user.email.value,
      password: await userPassword.getHashedValue(),
      type: user.type.value,
      ...overrides,
    },
  });
}
