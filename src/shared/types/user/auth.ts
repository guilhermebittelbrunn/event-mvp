import { UserTypeEnum } from './user';

import { EventAccessTypeEnum } from '../event/event';

export const JWT_DEFAULT_STRATEGY = 'jwt';

export const JWT_REFRESH_STRATEGY = 'jwt-refresh';

export const JWT_EVENT_STRATEGY = 'jwt-event';

export interface ITokenPayload {
  sub: string;
  email: string;
  role: UserTypeEnum;
  iat: number;
  exp: number;
}

export interface ITokenPayloadEvent {
  sub: string;
  type: EventAccessTypeEnum;
  slug: string;
  iat: number;
  exp: number;
}

export interface ITokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  expiresAt: number;
}
