import { Inject, Injectable } from '@nestjs/common';

import { UpdateUserDTO } from './dto/updateUser.dto';
import UpdateUserErrors from './updateUser.error';

import User from '@/module/user/domain/user/user';
import UserEmail from '@/module/user/domain/user/userEmail';
import UserType from '@/module/user/domain/user/userType';
import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { coalesce } from '@/shared/core/utils/undefinedHelpers';

@Injectable()
export class UpdateUserService {
  constructor(@Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository) {}

  async execute(dto: UpdateUserDTO) {
    const currentUser = await this.userRepo.findById(dto.id);

    if (!currentUser) {
      throw new UpdateUserErrors.NotFoundError();
    }

    const { userEmail, userType } = await this.buildEntities(dto);

    const user = User.create(
      {
        ...currentUser,
        password: currentUser.password,
        name: coalesce(dto.name, currentUser.name),
        email: coalesce(userEmail, currentUser.email),
        type: coalesce(userType, currentUser.type),
      },
      new UniqueEntityID(dto.id),
    );

    return this.userRepo.update(user);
  }

  private async buildEntities({ email, type }: UpdateUserDTO) {
    let userType: UserType | undefined;
    let userEmail: UserEmail | undefined;

    if (type) {
      userType = UserType.create(type);
    }

    if (email) {
      const userWithSameCredentials = await this.userRepo.findByEmail(email);

      if (userWithSameCredentials) {
        throw new UpdateUserErrors.EmailAlreadyInUse(email);
      }

      userEmail = UserEmail.create(email);
    }

    return { userType, userEmail };
  }
}
