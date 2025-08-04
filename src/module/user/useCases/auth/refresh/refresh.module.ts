import { Module } from '@nestjs/common';

import { RefreshController } from './refresh.controller';
import { RefreshService } from './refresh.service';

import { UserRepository } from '@/module/user/repositories/implementations/user.repository';
import { IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import { NestJwtModule } from '@/shared/services/jwt/implementations/nest-jwt/nestJwt.module';
import { NestJwtService } from '@/shared/services/jwt/implementations/nest-jwt/nestJwt.service';
import { IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';

@Module({
  imports: [NestJwtModule],
  controllers: [RefreshController],
  providers: [
    RefreshService,
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
export class RefreshModule {}
