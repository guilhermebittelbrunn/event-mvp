import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IJwtService } from '../../jwt.interface';

import { ISessionUser } from '@/shared/types/user';
import { ACCESS_TOKEN_EXPIRE_DAYS, EXPIRE_TOKEN_TIME, REFRESH_TOKEN_EXPIRE_DAYS } from '@/shared/utils';

@Injectable()
export class NestJwtService implements IJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async generateTokens({ id, ...rest }: ISessionUser) {
    const payload = {
      sub: id,
      ...rest,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: `${ACCESS_TOKEN_EXPIRE_DAYS}d`,
        secret: this.configService.getOrThrow('jwt.secret'),
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: `${REFRESH_TOKEN_EXPIRE_DAYS}d`,
        secret: this.configService.getOrThrow('jwt.refreshSecret'),
      }),
      /** Refers to the access_token */
      expires_in: EXPIRE_TOKEN_TIME,
      /** Refers to the access_token */
      expires_at: new Date().setTime(new Date().getTime() + EXPIRE_TOKEN_TIME),
    };
  }
}
