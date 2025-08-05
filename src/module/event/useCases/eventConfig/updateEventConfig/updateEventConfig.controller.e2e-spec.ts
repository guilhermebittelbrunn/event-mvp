import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { insertFakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { insertFakeEventConfig } from '@/module/event/repositories/tests/entities/fakeEventConfig';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('UpdateEventConfigController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('PUT /v1/event/:eventId/config/:id', () => {
    it('should update a event config successfully', async () => {
      const event = await insertFakeEvent();
      const eventConfig = await insertFakeEventConfig({ eventId: event.id });
      const newWelcomeMessage = faker.lorem.sentence();

      const result = await request()
        .put(`/v1/event/${event.id}/config/${eventConfig.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({ welcomeMessage: newWelcomeMessage })
        .expect(HttpStatus.OK);

      const updatedEventConfig = await prisma.eventConfigModel.findUnique({
        where: {
          id: eventConfig.id,
        },
      });

      expect(result.body.data.id).toBe(eventConfig.id);
      expect(updatedEventConfig.welcomeMessage).toBe(newWelcomeMessage);
    });
  });
});
