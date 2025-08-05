import { prisma } from '@database/index';
import { HttpStatus } from '@nestjs/common';

import { insertFakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('DeleteEventController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('DELETE /v1/event/:id', () => {
    it('should delete an event successfully', async () => {
      const event = await insertFakeEvent();

      await request()
        .delete(`/v1/event/${event.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .expect(HttpStatus.NO_CONTENT);

      const deletedEvent = await prisma.eventModel.findFirst({
        where: {
          id: event.id,
        },
      });

      expect(deletedEvent).toBeNull();
    });
  });
});
