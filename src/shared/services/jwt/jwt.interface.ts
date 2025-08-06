import { ITokenPayload, ITokenPayloadEvent, ITokenResponse } from '@/shared/types/user';

export interface IGenerateTokenPayload extends Pick<ITokenPayload, 'email' | 'role'> {
  id: string;
}

export interface IGenerateEventTokenPayload extends Pick<ITokenPayloadEvent, 'id' | 'type' | 'slug'> {
  expiresAt: number;
}

export interface IJwtService {
  generateTokens(payload: IGenerateTokenPayload): Promise<ITokenResponse>;
  generateEventToken(payload: IGenerateEventTokenPayload): Promise<ITokenResponse>;
}

export const IJwtServiceSymbol = Symbol('IJwtService');
