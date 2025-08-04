import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import GenericErrors from '@/shared/core/logic/GenericErrors';
import { IJwtService, IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';

@Injectable()
export class RefreshService {
  constructor(
    @Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository,
    @Inject(IJwtServiceSymbol) private readonly jwtService: IJwtService,
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new GenericErrors.NotFound('Usuário não encontrado');
    }

    const tokens = await this.jwtService.generateTokens({
      id: user.id.toValue(),
      email: user.email.value,
      role: user.type.value,
    });

    return { user, tokens };
  }
}
