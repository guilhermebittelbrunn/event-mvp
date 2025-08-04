import helmet from '@fastify/helmet';
import { VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@/app.module';

let app: NestFastifyApplication;
let moduleFixture: TestingModule;

beforeAll(async () => {
  moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    providers: [],
  }).compile();

  /**
   * Configures the app to use a similar configuration as the one used in production.
   * Not all configurations are needed for testing, mind putting here only the ones relevant.
   */
  app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter(), {
    cors: true,
  });

  app.register(helmet);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  jest.clearAllMocks();
});

afterAll(async () => {
  await app.close();
});

export { app };
