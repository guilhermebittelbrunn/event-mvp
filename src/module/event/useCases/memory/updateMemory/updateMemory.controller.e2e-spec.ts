import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { insertFakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('UpdateMemoryController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('PUT /v1/memory/:id', () => {
    it('should update a memory successfully', async () => {
      const memory = await insertFakeMemory();
      const newMessage = faker.lorem.words(3);

      const result = await request()
        .put(`/v1/memory/${memory.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({ message: newMessage })
        .expect(HttpStatus.OK);

      const updatedMemory = await prisma.memoryModel.findUnique({
        where: {
          id: memory.id,
        },
      });

      expect(result.body.data.id).toBe(memory.id);
      expect(updatedMemory.message).toBe(newMessage);
    });
  });
});
