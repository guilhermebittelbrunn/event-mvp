import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_REFRESH_STRATEGY } from '../types/user';

/**
 * You can implement multiple types of guards, not varying only in the strategy,
 * but also in the way they `validate`. For example, you can have a guard
 * that validates users that are related to an entity of type `business` specifically.
 * You differentiate them by the name of the guard, which is the first argument here,
 * and the name of the strategy, which is the second argument (on the strategy declaration).
 */

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_STRATEGY) {}
