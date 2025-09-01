import { ExecutionContext, Injectable } from '@nestjs/common';
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
  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   console.log('request :>> ', request.headers);
  //   try {
  //     return super.canActivate(context);
  //   } catch (error) {
  //     console.log('error :>> ', error);
  //     return false;
  //   }
  // }
  override handleRequest(err: any, event: any, _: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (err || !event) {
      throw err || new Error('Event authentication failed');
    }

    request.event = event;

    return event;
  }
}
