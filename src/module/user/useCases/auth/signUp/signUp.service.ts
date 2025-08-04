import { Inject, Injectable } from '@nestjs/common';

import { SignUpDTO } from './dto/signUp.dto';
import SignUpErrors from './signUp.error';

import User from '@/module/user/domain/user/user';
import UserEmail from '@/module/user/domain/user/userEmail';
import UserPassword from '@/module/user/domain/user/userPassword';
import UserType from '@/module/user/domain/user/userType';
import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { UserTypeEnum } from '@/shared/types/user';

@Injectable()
export class SignUpService {
  constructor(@Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository) {}

  async execute(dto: SignUpDTO) {
    const userWithSameCredentials = await this.userRepo.findByEmail(dto.email);

    if (userWithSameCredentials) {
      throw new SignUpErrors.EmailAlreadyInUse(dto.email);
    }

    const { userType, userPassword, userEmail } = this.buildEntities(dto);

    const user = User.create({
      ...dto,
      email: userEmail,
      password: userPassword,
      type: userType,
    });

    return this.userRepo.create(user);
  }

  private buildEntities(dto: SignUpDTO) {
    const userType = UserType.create(dto.type || UserTypeEnum.COMMON);

    const userPassword = UserPassword.create({ value: dto.password, hashed: false });

    const userEmail = UserEmail.create(dto.email);

    return { userType, userPassword, userEmail };
  }
}
