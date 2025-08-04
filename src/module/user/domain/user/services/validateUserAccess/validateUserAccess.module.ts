import { Global, Module } from '@nestjs/common';

import { ValidateUserAccess } from './validateUserAccess.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { AlsModule } from '@/shared/services/als/als.module';

@Global()
@Module({
  imports: [AlsModule],
  providers: [
    ValidateUserAccess,
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
  ],
  exports: [ValidateUserAccess],
})
export class ValidateUserAccessModule {}
