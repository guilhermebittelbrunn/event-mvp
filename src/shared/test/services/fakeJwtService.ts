import { IJwtService } from '@/shared/services/jwt/jwt.interface';

export class FakeJwtService implements IJwtService {
  generateTokens = jest.fn();
}
