import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserTypeEnum } from '../types/user';

import User from '@/module/user/domain/user/user';

/**
 * @note Este guard deve ser usado em conjunto com `JwtAuthGuard`.
 */

@Injectable()
export class UserRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new Error('User not found in request. Did you forget to add the `JwtAuthGuard` to this route?');
    }

    const user = request.user as User;

    if ([UserTypeEnum.ADMIN].includes(user.type?.value)) {
      return true;
    }

    return false;
  }
}
