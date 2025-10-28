import { Module } from '@nestjs/common';

import { RefreshModule } from './refresh/refresh.module';
import { SignInModule } from './signIn/signIn.module';
import { SignInByTokenModule } from './signInByToken/signInByToken.module';
import { SignUpModule } from './signUp/signUp.module';

@Module({
  imports: [SignUpModule, SignInModule, RefreshModule, SignInByTokenModule],
})
export class AuthModule {}
