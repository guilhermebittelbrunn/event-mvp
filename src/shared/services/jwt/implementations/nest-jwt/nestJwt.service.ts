import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { endOfDay } from 'date-fns';

import { IGenerateEventTokenPayload, IGenerateTokenPayload, IJwtService } from '../../jwt.interface';

import { ITokenPayload, ITokenPayloadEvent } from '@/shared/types';
import { ACCESS_TOKEN_EXPIRE_DAYS, EXPIRE_TOKEN_TIME, REFRESH_TOKEN_EXPIRE_DAYS } from '@/shared/utils';

@Injectable()
export class NestJwtService implements IJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens({ id, ...rest }: IGenerateTokenPayload) {
    const payload: Omit<ITokenPayload, 'iat' | 'exp'> = {
      sub: id,
      ...rest,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: `${ACCESS_TOKEN_EXPIRE_DAYS}d`,
        secret: this.configService.getOrThrow('jwt.secret'),
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: `${REFRESH_TOKEN_EXPIRE_DAYS}d`,
        secret: this.configService.getOrThrow('jwt.refreshSecret'),
      }),
      /** Refers to the access_token */
      expiresIn: EXPIRE_TOKEN_TIME,
      /** Refers to the access_token */
      expiresAt: new Date().setTime(new Date().getTime() + EXPIRE_TOKEN_TIME),
    };
  }

  async generateEventToken({ id, expiresAt, ...rest }: IGenerateEventTokenPayload) {
    const payload: Omit<ITokenPayloadEvent, 'iat' | 'exp'> = {
      sub: id,
      ...rest,
    };

    const now = new Date().getTime();
    const eventExpirationTime = endOfDay(expiresAt).getTime() - now;

    // ensure minimum expiration time (at least 1 minute)
    const minExpirationTime = 60 * 1000;
    const finalExpirationTime = Math.max(eventExpirationTime, minExpirationTime);

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: Math.floor(finalExpirationTime / 1000),
        secret: this.configService.getOrThrow('jwt.eventSecret'),
      }),
      expiresIn: finalExpirationTime,
      expiresAt: endOfDay(expiresAt).getTime(),
    };
  }
}
