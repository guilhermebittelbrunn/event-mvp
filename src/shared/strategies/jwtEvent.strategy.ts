import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ITokenPayloadEvent, JWT_EVENT_STRATEGY } from '../types/user';

import Event from '@/module/event/domain/event/event';
import { ValidateEventAccess } from '@/module/event/domain/event/services/validateEventAccess/validateEventAccess.service';

@Injectable()
export class JwtEventStrategy extends PassportStrategy(Strategy, JWT_EVENT_STRATEGY) {
  constructor(
    private readonly validateEventAccess: ValidateEventAccess,
    protected readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('event-token'), // event-token: <token>
      secretOrKey: config.getOrThrow('jwt.eventSecret'),
    });
  }

  async validate({ sub }: ITokenPayloadEvent): Promise<Event> {
    return this.validateEventAccess.execute(sub);
  }
}
