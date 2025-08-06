import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ValidateEventAccessModule } from '@/module/event/domain/event/services/validateEventAccess/validateEventAccess.module';
import { NestJwtModule } from '@/shared/services/jwt/implementations/nest-jwt/nestJwt.module';

@Global()
@Module({
  imports: [NestJwtModule, ValidateEventAccessModule, ConfigModule],
  exports: [NestJwtModule, ValidateEventAccessModule, ConfigModule],
})
export class EventAuthModule {}
