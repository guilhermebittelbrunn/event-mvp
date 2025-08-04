import { Module } from '@nestjs/common';

import { DeleteUserController } from './deleteUser.controller';
import { DeleteUserService } from './deleteUser.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';

@Module({
  controllers: [DeleteUserController],
  providers: [
    DeleteUserService,
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
  ],
})
export class DeleteUserModule {}
