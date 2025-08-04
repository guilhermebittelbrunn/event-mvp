import { UserModel } from '@prisma/client';

import User from '../domain/user/user';
import UserEmail from '../domain/user/userEmail';
import UserPassword from '../domain/user/userPassword';
import UserType from '../domain/user/userType';
import { UserDTO } from '../dto/user.dto';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { UserTypeEnum } from '@/shared/types/user/user';

export interface UserModelWithRelations extends UserModel {}

class BaseUserMapper extends Mapper<User, UserModelWithRelations, UserDTO> {
  toDomain(user: UserModelWithRelations): User {
    return User.create(
      {
        name: user.name,
        email: UserEmail.create(user.email),
        password: UserPassword.create({ value: user.password, hashed: true }),
        type: UserType.create(user.type as UserTypeEnum),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
      new UniqueEntityID(user.id),
    );
  }

  async toPersistence(user: User): Promise<UserModel> {
    return {
      id: user.id.toValue(),
      name: user.name,
      email: user.email.value,
      password: await user.password.getHashedValue(),
      type: user.type.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  toDTO(user: User): UserDTO {
    return {
      id: user.id.toValue(),
      name: user.name,
      email: user.email.value,
      type: user.type.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}

const UserMapper = new BaseUserMapper();

export default UserMapper;
