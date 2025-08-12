/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { HttpStatus } from '@nestjs/common';

import { insertFakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

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

describe('UpdateMemoryController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();

    jest.spyOn(S3StorageService.prototype, 'upload').mockResolvedValue(faker.internet.url());
    jest.spyOn(S3StorageService.prototype, 'delete').mockResolvedValue(undefined);
  });

  describe('PUT /v1/memory/:id', () => {
    it('should update a memory successfully', async () => {
      const memory = await insertFakeMemory();
      const newMessage = faker.lorem.words(3);

      const result = await request()
        .put(`/v1/memory/${memory.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .field('message', newMessage)
        .expect(HttpStatus.OK);

      const updatedMemory = await prisma.memoryModel.findUnique({
        where: {
          id: memory.id,
        },
      });
      expect(result.body.data.id).toBe(memory.id);
      expect(updatedMemory.message).toBe(newMessage);
    });

    it('should update a memory successfully with a new file', async () => {
      const memory = await insertFakeMemory();
      const newMessage = faker.lorem.words(3);
      const file = makeFile();

      const result = await request()
        .put(`/v1/memory/${memory.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .field('message', newMessage)
        .attach('image', file.buffer, file.originalname)
        .expect(HttpStatus.OK);

      const updatedMemory = await prisma.memoryModel.findUnique({
        where: {
          id: memory.id,
        },
      });
      const newFile = await prisma.fileModel.findFirst({
        where: {
          entityId: memory.id,
        },
      });
      expect(result.body.data.id).toBe(memory.id);
      expect(updatedMemory.message).toBe(newMessage);
      expect(newFile.path).toBeDefined();
      expect(newFile.url).toBeDefined();
    });
  });
});
