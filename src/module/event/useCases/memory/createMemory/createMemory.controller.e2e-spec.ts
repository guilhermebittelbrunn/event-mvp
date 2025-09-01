/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { HttpStatus } from '@nestjs/common';

import { CreateMemoryDTO } from './dto/createMemory.dto';

import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';
import getAuthenticatedEvent, { IAuthenticatedEventData } from '@/shared/test/helpers/getAuthenticatedEvent';
import { request } from '@/shared/test/utils';

const makePayload = (overrides: Partial<CreateMemoryDTO> = {}): CreateMemoryDTO => ({
  identifier: faker.string.uuid(),
  description: faker.lorem.paragraph(),
  message: faker.lorem.sentence(),
  ipAddress: faker.internet.ip(),
  eventId: faker.string.uuid(),
  image: makeFile(),
  ...overrides,
});

const makeFile = (overrides?: File) => {
  return {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 100,
    ...overrides,
  };
};

describe('CreateMemoryController (e2e)', () => {
  let authInfos: IAuthenticatedEventData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedEvent();

    jest.spyOn(S3StorageService.prototype, 'upload').mockResolvedValue(faker.internet.url());
  });

  describe('POST /v1/memory', () => {
    it('should create a memory successfully', async () => {
      const payload = makePayload();
      const file = makeFile();

      const result = await request()
        .post(`/v1/memory`)
        .set('authorization', `Bearer ${authInfos.accessToken}`)
        .field('identifier', payload.identifier)
        .field('description', payload.description)
        .field('message', payload.message)
        .attach('image', file.buffer, file.originalname)
        .expect(HttpStatus.CREATED);

      const newMemory = await prisma.memoryModel.findUnique({
        where: {
          id: result.body.data.id,
        },
      });
      const newFile = await prisma.fileModel.findUnique({
        where: {
          id: newMemory.fileId,
        },
      });

      expect(newMemory.identifier).toBe(result.body.data.identifier);
      expect(newMemory.eventId).toBe(result.body.data.eventId);
      expect(newMemory.ipAddress).toBeDefined();
      expect(newFile.path).toBeDefined();
      expect(newFile.url).toBeDefined();
      expect(newFile.name).toBeDefined();
      expect(newFile.id).toBe(newMemory.fileId);
    });
  });
});
