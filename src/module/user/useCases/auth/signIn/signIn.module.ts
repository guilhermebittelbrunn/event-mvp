import { Module } from '@nestjs/common';

import { SignInController } from './signIn.controller';
import { SignInService } from './signIn.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { NestJwtModule } from '@/shared/services/jwt/implementations/nest-jwt/nestJwt.module';
import { NestJwtService } from '@/shared/services/jwt/implementations/nest-jwt/nestJwt.service';
import { IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';

@Module({
  imports: [NestJwtModule],
  controllers: [SignInController],
  providers: [
    SignInService,
    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
    {
      provide: IJwtServiceSymbol,
      useClass: NestJwtService,
    },
  ],
})
export class SignInModule {}
