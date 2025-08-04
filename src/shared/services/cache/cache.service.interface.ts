export default interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
}

export const ICacheServiceSymbol = Symbol('ICacheService');
