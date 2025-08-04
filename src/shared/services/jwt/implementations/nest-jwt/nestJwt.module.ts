import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { NestJwtService } from './nestJwt.service';

@Module({
  imports: [JwtModule],
  providers: [NestJwtService],
  exports: [NestJwtService, JwtModule],
})
export class NestJwtModule {}
