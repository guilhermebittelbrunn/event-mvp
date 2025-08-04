import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

@Injectable()
export class FindUserByIdService {
  constructor(@Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new GenericErrors.NotFound(`Usuário com id ${id} não encontrado`);
    }

    return user;
  }
}
