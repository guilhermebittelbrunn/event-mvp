import User from '../domain/user/user';
import UserEmail from '../domain/user/userEmail';

import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { UserTypeEnum } from '@/shared/types';

export interface ListUserByQuery extends PaginationQuery {
  types?: UserTypeEnum[];
}

export interface IUserRepository extends IBaseRepository<User> {
  list(query?: ListUserByQuery): Promise<PaginatedResult<User>>;
  findByEmail(email: string | UserEmail): SingleEntityResponse<User>;
}

export const IUserRepositorySymbol = Symbol('IUserRepository');
