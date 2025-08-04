import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { PaginationQuery } from '@/shared/core/infra/pagination.interface';

@Injectable()
export class ListUsersService {
  constructor(@Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository) {}

  async execute(query?: PaginationQuery) {
    return this.userRepo.list(query);
  }
}
