import { ConfigService } from '@nestjs/config';

export class FakeConfigService extends ConfigService {
  getOrThrow = jest.fn();
  get = jest.fn();
  set = jest.fn();
}
