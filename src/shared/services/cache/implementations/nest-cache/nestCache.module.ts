import { CacheModule as CacheModuleNest } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

import { NestCacheService } from './nestCache.service';

import { CACHE_MAX_ITEMS, CACHE_TTL_MS } from '@/shared/core/utils/consts';

@Global()
@Module({
  imports: [
    CacheModuleNest.register({
      isGlobal: true,
      ttl: CACHE_TTL_MS,
      max: CACHE_MAX_ITEMS,
    }),
  ],
  providers: [NestCacheService],
  exports: [NestCacheService],
})
export class NestCacheModule {}
