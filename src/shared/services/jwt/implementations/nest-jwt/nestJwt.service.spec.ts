import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { NestJwtService } from './nestJwt.service';

import { EventAccessTypeEnum } from '@/shared/types/event/event';
import { UserTypeEnum } from '@/shared/types/user/user';
import { accessToken_EXPIRE_DAYS, EXPIRE_TOKEN_TIME, REFRESH_TOKEN_EXPIRE_DAYS } from '@/shared/utils';

describe('NestJwtService', () => {
  let service: NestJwtService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NestJwtService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NestJwtService>(NestJwtService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens successfully', async () => {
      const mockPayload = {
        id: uuid(),
        email: faker.internet.email(),
        role: UserTypeEnum.ADMIN,
      };

      const mockAccessToken = 'mock.access.token';
      const mockRefreshToken = 'mock.refresh.token';
      const mockJwtSecret = 'jwt-secret';
      const mockJwtRefreshSecret = 'jwt-refresh-secret';

      jest
        .spyOn(configService, 'getOrThrow')
        .mockReturnValueOnce(mockJwtSecret)
        .mockReturnValueOnce(mockJwtRefreshSecret);

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await service.generateTokens(mockPayload);

      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.secret');
      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.refreshSecret');

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockPayload.id, email: mockPayload.email, role: mockPayload.role },
        {
          expiresIn: `${accessToken_EXPIRE_DAYS}d`,
          secret: mockJwtSecret,
        },
      );

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockPayload.id, email: mockPayload.email, role: mockPayload.role },
        {
          expiresIn: `${REFRESH_TOKEN_EXPIRE_DAYS}d`,
          secret: mockJwtRefreshSecret,
        },
      );

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        expiresIn: EXPIRE_TOKEN_TIME,
        expiresAt: expect.any(Number),
      });

      // Verify expiresAt is calculated correctly
      const now = Date.now();
      expect(result.expiresAt).toBeGreaterThan(now);
      expect(result.expiresAt).toBeLessThanOrEqual(now + EXPIRE_TOKEN_TIME);
    });

    it('should handle config service errors', async () => {
      const mockPayload = { id: uuid(), email: faker.internet.email(), role: UserTypeEnum.ADMIN };

      jest.spyOn(configService, 'getOrThrow').mockImplementation(() => {
        throw new Error('Config error');
      });

      await expect(service.generateTokens(mockPayload)).rejects.toThrow('Config error');
    });

    it('should handle jwt service errors', async () => {
      const mockPayload = { id: uuid(), email: faker.internet.email(), role: UserTypeEnum.ADMIN };

      jest.spyOn(configService, 'getOrThrow').mockReturnValue('jwt-secret');
      jest.spyOn(jwtService, 'signAsync').mockRejectedValue(new Error('JWT error'));

      await expect(service.generateTokens(mockPayload)).rejects.toThrow('JWT error');
    });
  });

  describe('generateEventToken', () => {
    it('should generate event token with expiration based on event end time + 8 hours', async () => {
      const now = Date.now();
      const mockPayload = {
        id: uuid(),
        slug: faker.internet.url(),
        type: EventAccessTypeEnum.GUEST,
        expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours from now
      };

      const mockAccessToken = 'mock.event.token';
      const mockJwtSecret = 'jwt-secret';

      jest.spyOn(configService, 'getOrThrow').mockReturnValue(mockJwtSecret);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);

      const result = await service.generateEventToken(mockPayload);

      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.eventSecret');

      // Verify the payload structure
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockPayload.id, slug: mockPayload.slug, type: mockPayload.type },
        expect.objectContaining({
          secret: mockJwtSecret,
        }),
      );

      // Verify the expiration calculation with some tolerance
      const eightHoursInMs = 8 * 60 * 60 * 1000;
      const expectedExpirationTime = mockPayload.expiresAt + eightHoursInMs - now;
      const expectedExpirationSeconds = Math.floor(expectedExpirationTime / 1000);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          expiresIn: expect.any(Number),
        }),
      );

      // Verify the expiresIn is within a reasonable range (within 1 second)
      const actualCall = (jwtService.signAsync as jest.Mock).mock.calls[0];
      const actualExpiresIn = actualCall[1].expiresIn;
      expect(actualExpiresIn).toBeGreaterThanOrEqual(expectedExpirationSeconds - 1);
      expect(actualExpiresIn).toBeLessThanOrEqual(expectedExpirationSeconds + 1);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        expiresIn: expect.any(Number),
        expiresAt: mockPayload.expiresAt + eightHoursInMs,
      });

      // Verify expiresIn is calculated correctly (within 1 second tolerance)
      expect(result.expiresIn).toBeGreaterThanOrEqual(expectedExpirationTime - 1000);
      expect(result.expiresIn).toBeLessThanOrEqual(expectedExpirationTime + 1000);
    });

    it('should ensure minimum expiration time of 1 minute', async () => {
      const now = Date.now();
      const mockPayload = {
        id: uuid(),
        slug: faker.internet.url(),
        type: EventAccessTypeEnum.GUEST,
        expiresAt: now - 10 * 60 * 60 * 1000, // Event ended 10 hours ago
      };

      const mockAccessToken = 'mock.event.token';
      const mockJwtSecret = 'jwt-secret';

      jest.spyOn(configService, 'getOrThrow').mockReturnValue(mockJwtSecret);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);

      const result = await service.generateEventToken(mockPayload);

      // Should use minimum expiration time (1 minute = 60 seconds)
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          expiresIn: 60,
        }),
      );

      expect(result.expiresIn).toBe(60 * 1000); // 1 minute in milliseconds
      expect(result.expiresAt).toBe(mockPayload.expiresAt + 8 * 60 * 60 * 1000); // 8 hours after event end
    });

    it('should handle event that ends in the future', async () => {
      const now = Date.now();
      const mockPayload = {
        id: uuid(),
        slug: faker.internet.url(),
        type: EventAccessTypeEnum.GUEST,
        expiresAt: now + 2 * 60 * 60 * 1000, // 2 hours from now
      };

      const mockAccessToken = 'mock.event.token';
      const mockJwtSecret = 'jwt-secret';

      jest.spyOn(configService, 'getOrThrow').mockReturnValue(mockJwtSecret);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);

      const result = await service.generateEventToken(mockPayload);

      const eightHoursInMs = 8 * 60 * 60 * 1000;
      const expectedExpirationTime = mockPayload.expiresAt + eightHoursInMs - now;

      // Verify with tolerance for timing differences
      expect(result.expiresIn).toBeGreaterThanOrEqual(expectedExpirationTime - 1000);
      expect(result.expiresIn).toBeLessThanOrEqual(expectedExpirationTime + 1000);
      expect(result.expiresAt).toBe(mockPayload.expiresAt + eightHoursInMs);
    });

    it('should handle config service errors', async () => {
      const mockPayload = {
        id: uuid(),
        slug: faker.internet.url(),
        type: EventAccessTypeEnum.GUEST,
        expiresAt: Date.now() + 1000,
      };

      jest.spyOn(configService, 'getOrThrow').mockImplementation(() => {
        throw new Error('Config error');
      });

      await expect(service.generateEventToken(mockPayload)).rejects.toThrow('Config error');
    });

    it('should handle jwt service errors', async () => {
      const mockPayload = {
        id: uuid(),
        slug: faker.internet.url(),
        type: EventAccessTypeEnum.GUEST,
        expiresAt: Date.now() + 1000,
      };

      jest.spyOn(configService, 'getOrThrow').mockReturnValue('jwt-secret');
      jest.spyOn(jwtService, 'signAsync').mockRejectedValue(new Error('JWT error'));

      await expect(service.generateEventToken(mockPayload)).rejects.toThrow('JWT error');
    });
  });
});
