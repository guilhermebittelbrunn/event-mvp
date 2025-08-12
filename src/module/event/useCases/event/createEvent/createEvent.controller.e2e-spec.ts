/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { HttpStatus } from '@nestjs/common';

import { CreateEventDTO } from './dto/createEvent.dto';

import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

const makePayload = (overrides: Partial<CreateEventDTO> = {}): CreateEventDTO => ({
  name: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  startAt: faker.date.past(),
  endAt: faker.date.soon(),
  userId: faker.string.uuid(),
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

describe('CreateEventController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('POST /v1/event', () => {
    it('should create a event successfully', async () => {
      const payload = makePayload();
      const file = makeFile();

      const result = await request()
        .post(`/v1/event`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .field('name', payload.name)
        .field('description', payload.description)
        .field('startAt', payload.startAt.toISOString())
        .field('endAt', payload.endAt.toISOString())
        .field('slug', payload.slug)
        .attach('image', file.buffer, file.originalname)
        .expect(HttpStatus.CREATED);

      const newEvent = await prisma.eventModel.findUnique({
        where: {
          id: result.body.data.id,
        },
        include: {
          config: true,
          accesses: true,
        },
      });

      const newFile = await prisma.fileModel.findFirst({
        where: {
          entityId: newEvent.id,
        },
      });

      const eventConfig = await prisma.eventConfigModel.findFirst({
        where: {
          eventId: newEvent.id,
        },
      });

      const eventAccesses = await prisma.eventAccessModel.findMany({
        where: {
          eventId: newEvent.id,
        },
      });

      expect(newEvent.name).toBe(result.body.data.name);
      expect(newEvent.description).toBe(result.body.data.description);
      expect(newEvent.startAt.toISOString()).toBe(result.body.data.startAt);
      expect(newEvent.endAt.toISOString()).toBe(result.body.data.endAt);
      expect(eventConfig).toBeDefined();
      expect(eventAccesses).toBeDefined();
      expect(newFile.path).toBeDefined();
      expect(newFile.url).toBeDefined();
      expect(newFile.name).toBeDefined();
      expect(newFile.entityId).toBe(newEvent.id);
    });

    it('should return 400 when invalid data is provided', async () => {
      const response = await request()
        .post(`/v1/event`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({
          startAt: faker.date.past(),
          endAt: faker.date.past(),
        })
        .expect(HttpStatus.BAD_REQUEST);
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.arrayContaining([
          'nome informado deve ser um texto válido',
          'link de acesso informado deve ser um texto válido',
        ]),
      });
    });
  });
});
