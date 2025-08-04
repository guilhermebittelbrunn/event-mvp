import { Module } from '@nestjs/common';

import { ListUsersController } from './listUsers.controller';
import { ListUsersService } from './listUsers.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';

@Module({
  controllers: [ListUsersController],
  providers: [
    ListUsersService,
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
  ],
})
export class ListUsersModule {}
