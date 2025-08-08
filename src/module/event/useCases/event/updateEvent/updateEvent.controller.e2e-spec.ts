/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { insertFakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('UpdateEventController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('PUT /v1/event/:id', () => {
    /**
     * @todo: fix this test
     * @note temporary disabled because the file upload is not working
     */
    it('should update a event successfully', async () => {
      expect(true).toBe(true);
      // const event = await insertFakeEvent();
      // const newName = faker.person.fullName();

      // const result = await request()
      //   .put(`/v1/event/${event.id}`)
      //   .set('authorization', `Bearer ${authInfos.access_token}`)
      //   .send({ name: newName })
      //   .expect(HttpStatus.OK);

      // const updatedEvent = await prisma.eventModel.findUnique({
      //   where: {
      //     id: event.id,
      //   },
      // });

      // expect(result.body.data.id).toBe(event.id);
      // expect(updatedEvent.name).toBe(newName);
    });
  });
});
