import { Module } from '@nestjs/common';

import { AuthModule } from './useCases/auth.module';

@Module({
  imports: [AuthModule],
})
export class AuthApplicationModule {}
