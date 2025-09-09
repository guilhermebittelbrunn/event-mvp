import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_EVENT_STRATEGY } from '../types/user';

/**
 * You can implement multiple types of guards, not varying only in the strategy,
 * but also in the way they `validate`. For example, you can have a guard
 * that validates users that are related to an entity of type `business` specifically.
 * You differentiate them by the name of the guard, which is the first argument here,
 * and the name of the strategy, which is the second argument (on the strategy declaration).
 */

@Injectable()
export class JwtEventAuthGuard extends AuthGuard(JWT_EVENT_STRATEGY) {
  override handleRequest(err: any, event: any, _: any, context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();

      if (err || !event) {
        throw err || new Error('Event authentication failed');
      }

      request.event = event;

      return event;
    } catch (error) {
      throw new HttpException('Event authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
