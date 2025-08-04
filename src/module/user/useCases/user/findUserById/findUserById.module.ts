import { Module } from '@nestjs/common';

import { FindUserByIdController } from './findUserById.controller';
import { FindUserByIdService } from './findUserById.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';

@Module({
  controllers: [FindUserByIdController],
  providers: [
    FindUserByIdService,
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
  ],
})
export class FindUserByIdModule {}
