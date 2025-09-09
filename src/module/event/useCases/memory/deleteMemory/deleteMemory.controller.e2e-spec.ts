import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { insertFakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('DeleteMemoryController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('DELETE /v1/memory/:id', () => {
    it('should delete a memory successfully', async () => {
      const memory = await insertFakeMemory();

      await request()
        .delete(`/v1/memory/${memory.id}`)
        .set('authorization', `Bearer ${authInfos.accessToken}`)
        .expect(HttpStatus.NO_CONTENT);

      const deletedMemory = await prisma.memoryModel.findFirst({
        where: {
          id: memory.id,
        },
      });

      expect(deletedMemory).toBeNull();
    });

    it('should return 404 when memory does not exist', async () => {
      const response = await request()
        .delete(`/v1/memory/${faker.string.uuid()}`)
        .set('authorization', `Bearer ${authInfos.accessToken}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Memória não encontrada');
    });
  });
});
