import { Injectable } from '@nestjs/common';
import { Prisma, UserModel } from '@prisma/client';

import User from '../../domain/user/user';
import UserEmail from '../../domain/user/userEmail';
import UserMapper from '../../mappers/user.mapper';
import { IUserRepository, ListUserByQuery } from '../user.repository.interface';

import { PaginatedResult } from '@/shared/core/infra/pagination.interface';
import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { filledArray, isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class UserRepository extends BaseRepository<'userModel', User, UserModel> implements IUserRepository {
  mapper = UserMapper;

  constructor(prisma: PrismaService, als: Als) {
    super('userModel', prisma, als);
  }

  async list(query?: ListUserByQuery): Promise<PaginatedResult<User>> {
    const { page, take, skip, term } = this.getPaginationParams(query);

    const where: Prisma.UserModelWhereInput = {
      ...(filledArray(query?.types) && { type: { in: query.types } }),
      ...(!isEmpty(term) && {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      await this.manager().findMany({ skip, take, where }),
      await this.manager().count({ where }),
    ]);

    return {
      data: users.map(this.mapper.toDomain),
      meta: this.buildPaginationMeta(total, page, take),
    };
  }

  async findByEmail(email: string | UserEmail): Promise<User | null> {
    const emailValue = email instanceof UserEmail ? email.value : email;

    const user = await this.manager().findUnique({
      where: { email: emailValue },
    });

    return this.mapper.toDomainOrNull(user);
  }
}
