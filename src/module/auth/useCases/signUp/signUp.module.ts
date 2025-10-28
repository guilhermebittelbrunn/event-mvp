import { Module } from '@nestjs/common';

import { SignUpController } from './signUp.controller';
import { SignUpService } from './signUp.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';

@Module({
  controllers: [SignUpController],
  providers: [
    SignUpService,
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
  ],
  exports: [SignUpService],
})
export class SignUpModule {}
