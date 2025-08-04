import ICacheService from '@/shared/services/cache/cache.service.interface';

export class FakeCacheService implements ICacheService {
  get = jest.fn();
  set = jest.fn();
}
