import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { CreateMemoryDTO } from './dto/createMemory.dto';

import getAuthenticatedEvent, { IAuthenticatedEventData } from '@/shared/test/helpers/getAuthenticatedEvent';
import { request } from '@/shared/test/utils';

const makePayload = (overrides: Partial<CreateMemoryDTO> = {}): CreateMemoryDTO => ({
  identifier: faker.string.uuid(),
  description: faker.lorem.paragraph(),
  message: faker.lorem.sentence(),
  ipAddress: faker.internet.ip(),
  eventId: faker.string.uuid(),
  ...overrides,
});

describe('CreateMemoryController (e2e)', () => {
  let authInfos: IAuthenticatedEventData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedEvent();
  });

  describe('POST /v1/memory', () => {
    it('should create a memory successfully', async () => {
      const result = await request()
        .post(`/v1/memory`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send(makePayload())
        .expect(HttpStatus.CREATED);

      const newMemory = await prisma.memoryModel.findUnique({
        where: {
          id: result.body.data.id,
        },
      });

      expect(newMemory.identifier).toBe(result.body.data.identifier);
      expect(newMemory.eventId).toBe(result.body.data.eventId);
      expect(newMemory.ipAddress).toBeDefined();
    });
  });
});
