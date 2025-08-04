import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ITokenPayload, JWT_DEFAULT_STRATEGY } from '../types/user/auth';

import { ValidateUserAccess } from '@/module/user/domain/user/services/validateUserAccess/validateUserAccess.service';
import User from '@/module/user/domain/user/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_DEFAULT_STRATEGY) {
  constructor(
    private readonly validateUserAccess: ValidateUserAccess,
    protected readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow('jwt.secret'),
    });
  }

  validate({ sub }: ITokenPayload): Promise<User> {
    return this.validateUserAccess.validate(sub);
  }
}
