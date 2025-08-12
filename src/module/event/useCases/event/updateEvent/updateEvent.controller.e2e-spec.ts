/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { HttpStatus } from '@nestjs/common';

import { insertFakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { insertFakeEventAccess } from '@/module/event/repositories/tests/entities/fakeEventAccess';
import { insertFakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
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

describe('UpdateEventController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();

    jest.spyOn(S3StorageService.prototype, 'upload').mockResolvedValue(faker.internet.url());
    jest.spyOn(S3StorageService.prototype, 'delete').mockResolvedValue(undefined);
  });

  describe('PUT /v1/event/:id', () => {
    it('should update a event successfully', async () => {
      const filePayload = makeFile();
      const event = await insertFakeEvent();
      const access = await insertFakeEventAccess({ eventId: event.id });

      const rawSlug = `${faker.person.firstName()} ${faker.person.lastName()}`; // to avoid slug conflict with prefix as Dr. Mr. Sr. etc.
      const newSlug = rawSlug.trim().toLowerCase().replace(/ /g, '-');
      const newDescription = faker.lorem.paragraph();
      const file = await insertFakeFile({ entityId: event.id });

      const result = await request()
        .put(`/v1/event/${event.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .field('slug', rawSlug)
        .field('description', newDescription)
        .attach('image', filePayload.buffer, filePayload.originalname)
        .expect(HttpStatus.OK);

      const updatedEvent = await prisma.eventModel.findUnique({
        where: {
          id: event.id,
        },
      });

      const updatedAccess = await prisma.eventAccessModel.findFirst({
        where: {
          eventId: event.id,
        },
      });

      const uploadedFile = await prisma.fileModel.findFirst({
        where: {
          entityId: event.id,
        },
      });

      const deletedFile = await prisma.fileModel.findUnique({
        where: {
          id: file.id,
        },
      });

      expect(result.body.data.id).toBe(event.id);
      expect(updatedEvent.slug).toBe(newSlug);
      expect(updatedEvent.description).toBe(newDescription);

      expect(updatedAccess.eventId).toBe(event.id);
      expect(updatedAccess.url).not.toBe(access.url);
      expect(updatedAccess.url).toContain(newSlug);

      expect(uploadedFile.path).toBeDefined();
      expect(uploadedFile.url).toBeDefined();
      expect(uploadedFile.name).toBeDefined();
      expect(uploadedFile.entityId).toBe(event.id);

      expect(deletedFile).toBeNull();
    });
  });
});
