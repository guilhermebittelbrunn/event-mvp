import { Module } from '@nestjs/common';

import { SignInByTokenController } from './signInByToken.controller';
import { SignInByTokenService } from './signInByToken.service';

import { ValidateEventAccessModule } from '@/module/event/domain/event/services/validateEventAccess/validateEventAccess.module';
import { IEventAccessRepositorySymbol } from '@/module/event/repositories/eventAccess.repository.interface';
import { EventAccessRepository } from '@/module/event/repositories/implementations/eventAccess.repository';
import { NestJwtModule } from '@/shared/services/jwt/implementations/nest-jwt/nestJwt.module';
import { NestJwtService } from '@/shared/services/jwt/implementations/nest-jwt/nestJwt.service';
import { IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';

@Module({
  imports: [NestJwtModule, ValidateEventAccessModule],
  controllers: [SignInByTokenController],
  providers: [
    SignInByTokenService,
    {
      provide: IEventAccessRepositorySymbol,
      useClass: EventAccessRepository,
    },
    {
      provide: IJwtServiceSymbol,
      useClass: NestJwtService,
    },
  ],
})
export class SignInByTokenModule {}
