import { Inject, Injectable } from '@nestjs/common';

import { ListUsersDTO } from './dto/listUsers.dto';

import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { ValidatedQuery } from '@/shared/decorators';

@Injectable()
export class ListUsersService {
  constructor(@Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository) {}

  async execute(@ValidatedQuery() query?: ListUsersDTO) {
    return this.userRepo.list(query);
  }
}
