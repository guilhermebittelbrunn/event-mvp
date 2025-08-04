import { Module } from '@nestjs/common';

import { RefreshModule } from '../auth/refresh/refresh.module';
import { SignInModule } from '../auth/signIn/signIn.module';
import { SignUpModule } from '../auth/signUp/signUp.module';

@Module({
  imports: [SignUpModule, SignInModule, RefreshModule],
})
export class AuthModule {}
