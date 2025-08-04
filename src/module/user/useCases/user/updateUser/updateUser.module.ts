import { Module } from '@nestjs/common';

import { UpdateUserController } from './updateUser.controller';
import { UpdateUserService } from './updateUser.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';

@Module({
  controllers: [UpdateUserController],
  providers: [
    UpdateUserService,
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
  ],
})
export class UpdateUserModule {}
