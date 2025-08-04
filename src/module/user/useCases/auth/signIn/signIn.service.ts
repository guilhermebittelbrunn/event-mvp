import { Inject, Injectable } from '@nestjs/common';

import { SignInDTO } from './dto/signIn.dto';
import SignInErrors from './signIn.error';

import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { IJwtService, IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';

@Injectable()
export class SignInService {
  constructor(
    @Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository,
    @Inject(IJwtServiceSymbol) private readonly jwtService: IJwtService,
  ) {}

  async execute({ email, password }: SignInDTO) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new SignInErrors.NotFoundError();
    }

    const passwordMatch = await user.password.compare(password);

    if (!passwordMatch) {
      throw new SignInErrors.InvalidCredentials();
    }

    const tokens = await this.jwtService.generateTokens({
      id: user.id.toValue(),
      email: user.email.value,
      role: user.type.value,
    });

    return { user, tokens };
  }
}
