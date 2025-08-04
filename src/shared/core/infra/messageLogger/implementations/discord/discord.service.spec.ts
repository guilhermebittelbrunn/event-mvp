import { faker } from '@faker-js/faker/.';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { DiscordService } from './discord.service';

import { Als } from '@/shared/services/als/als.interface';
import { FakeAlsService, FakeHttpService } from '@/shared/test/services';

describe('DiscordService', () => {
  let service: DiscordService;
  let httpServiceMock: FakeHttpService;
  let alsMock: FakeAlsService;
  let mockMarketplace: { name: string; id: string };

  beforeEach(async () => {
    httpServiceMock = new FakeHttpService();
    alsMock = new FakeAlsService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: Als,
          useValue: alsMock,
        },
      ],
    }).compile();

    service = module.get<DiscordService>(DiscordService);

    httpServiceMock.post.mockReturnValue(of({ data: {} }));
    mockMarketplace = { name: faker.company.name(), id: faker.string.uuid() };
    alsMock.getStore.mockReturnValue({
      marketplace: mockMarketplace,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send info message successfully', async () => {
    const message = faker.lorem.paragraph();
    const identifier = faker.lorem.words(3);

    await service.info(message, identifier);

    expect(httpServiceMock.post).toHaveBeenCalledWith(
      expect.stringContaining('https://discord.com/api/webhooks'),
      expect.objectContaining({
        content: expect.stringContaining(message),
      }),
    );
  });

  it('should include environment in message', async () => {
    const originalEnv = process.env.NODE_ENV;
    const environment = faker.system.fileName();
    process.env.NODE_ENV = environment;

    await service.info(faker.lorem.paragraph());

    expect(httpServiceMock.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        content: expect.stringContaining(`[${environment.toUpperCase()}]`),
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle message without marketplace info', async () => {
    alsMock.getStore.mockReturnValueOnce({});

    await service.info(faker.lorem.paragraph());

    expect(httpServiceMock.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        content: expect.not.stringContaining('Marketplace'),
      }),
    );
  });

  it('should handle message without identifier', async () => {
    await service.info(faker.lorem.paragraph());

    expect(httpServiceMock.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        content: expect.not.stringContaining('Identificador'),
      }),
    );
  });
});
