import { ISessionUser, ITokenResponse } from '@/shared/types/user';

export interface IJwtService {
  generateTokens(payload: ISessionUser): Promise<ITokenResponse>;
}

export const IJwtServiceSymbol = Symbol('IJwtService');
