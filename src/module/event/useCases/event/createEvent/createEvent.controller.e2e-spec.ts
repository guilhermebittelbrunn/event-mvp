import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { CreateEventDTO } from './dto/createEvent.dto';

import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

const makePayload = (overrides: Partial<CreateEventDTO> = {}): CreateEventDTO => ({
  name: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  start_at: faker.date.past(),
  end_at: faker.date.soon(),
  userId: faker.string.uuid(),
  ...overrides,
});

describe('CreateEventController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('POST /v1/event', () => {
    it('should create a event successfully', async () => {
      const result = await request()
        .post(`/v1/event`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send(makePayload())
        .expect(HttpStatus.CREATED);

      const newEvent = await prisma.eventModel.findUnique({
        where: {
          id: result.body.data.id,
        },
      });

      expect(newEvent.name).toBe(result.body.data.name);
      expect(newEvent.description).toBe(result.body.data.description);
      expect(newEvent.start_at.toISOString()).toBe(result.body.data.start_at);
      expect(newEvent.end_at.toISOString()).toBe(result.body.data.end_at);
    });

    it('should return 400 when invalid data is provided', async () => {
      const response = await request()
        .post(`/v1/event`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({
          start_at: faker.date.past(),
          end_at: faker.date.past(),
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
