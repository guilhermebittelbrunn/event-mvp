import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';

@Injectable()
export class DeleteUserService {
  constructor(@Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository) {}

  async execute(id: string) {
    const deleted = await this.userRepo.delete(id);

    if (!deleted) {
      throw new GenericErrors.NotFound(`Usuário não encontrado`);
    }
  }
}
