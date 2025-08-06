import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IGenerateEventTokenPayload, IGenerateTokenPayload, IJwtService } from '../../jwt.interface';

import { ACCESS_TOKEN_EXPIRE_DAYS, EXPIRE_TOKEN_TIME, REFRESH_TOKEN_EXPIRE_DAYS } from '@/shared/utils';

@Injectable()
export class NestJwtService implements IJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens({ id, ...rest }: IGenerateTokenPayload) {
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

  async generateEventToken({ id, expiresAt, ...rest }: IGenerateEventTokenPayload) {
    const payload = {
      sub: id,
      ...rest,
    };

    // calculate expiration time based on event end time + 8 hours
    const now = new Date().getTime();
    const eightHoursInMs = 8 * 60 * 60 * 1000;
    const eventExpirationTime = expiresAt + eightHoursInMs - now;

    // ensure minimum expiration time (at least 1 minute)
    const minExpirationTime = 60 * 1000;
    const finalExpirationTime = Math.max(eventExpirationTime, minExpirationTime);

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: Math.floor(finalExpirationTime / 1000),
        secret: this.configService.getOrThrow('jwt.secret'),
      }),
      expires_in: finalExpirationTime,
      expires_at: expiresAt + eightHoursInMs,
    };
  }
}
