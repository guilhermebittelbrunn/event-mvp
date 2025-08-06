import { Module } from '@nestjs/common';

import { SignInByTokenModule } from './signInByToken/signInByToken.module';

import { RefreshModule } from '../auth/refresh/refresh.module';
import { SignInModule } from '../auth/signIn/signIn.module';
import { SignUpModule } from '../auth/signUp/signUp.module';

@Module({
  imports: [SignUpModule, SignInModule, RefreshModule, SignInByTokenModule],
})
export class AuthModule {}
