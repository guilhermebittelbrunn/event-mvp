import User from '../domain/user/user';
import UserEmail from '../domain/user/userEmail';

import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';

export interface IUserRepository extends IBaseRepository<User> {
  list(query?: PaginationQuery): Promise<PaginatedResult<User>>;
  findByEmail(email: string | UserEmail): SingleEntityResponse<User>;
}

export const IUserRepositorySymbol = Symbol('IUserRepository');
