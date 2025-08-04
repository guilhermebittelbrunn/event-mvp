import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import ICacheService from '../../cache.service.interface';

import { CACHE_TTL_MS } from '@/shared/core/utils/consts';

@Injectable()
export class NestCacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl: number = CACHE_TTL_MS): Promise<void> {
    return this.cacheManager.set(key, value, ttl);
  }
}
