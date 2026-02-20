import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isBefore } from 'date-fns';
import { Observable } from 'rxjs';

import Event from '@/module/event/domain/event/event';

/**
 * @note this guard should be used after the event authentication guard.
 */

@Injectable()
export class EventEndAtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.event) {
      throw new Error(
        'Event not found in request. Did you forget to add the `JwtEventAuthGuard` to this route?',
      );
    }

    const event: Event = request.event;

    if (isBefore(event?.endAt, new Date())) {
      throw new HttpException(
        'Esse recurso só pode ser acessado enquanto o evento estiver em andamento',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
