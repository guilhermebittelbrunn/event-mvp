import { UserTypeEnum } from './user';

export const JWT_DEFAULT_STRATEGY = 'jwt';

export const JWT_REFRESH_STRATEGY = 'jwt-refresh';

export interface ITokenPayload {
  sub: string;
  email: string;
  type: string;
  iat: number;
  exp: number;
}

export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}

export interface ISessionUser {
  id: string;
  email: string;
  role: UserTypeEnum;
}
