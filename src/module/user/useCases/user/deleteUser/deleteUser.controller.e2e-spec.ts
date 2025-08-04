import { prisma } from '@database/index';
import { faker } from '@faker-js/faker/.';
import { HttpStatus } from '@nestjs/common';

import { insertFakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('DeleteUserController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('DELETE /v1/user/:id', () => {
    it('should delete a user successfully', async () => {
      const user = await insertFakeUser();

      await request()
        .delete(`/v1/user/${user.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .expect(HttpStatus.NO_CONTENT);

      const deletedUser = await prisma.userModel.findFirst({
        where: {
          id: user.id,
        },
      });

      expect(deletedUser).toBeNull();
    });

    it('should return 404 when user does not exist', async () => {
      const response = await request()
        .delete(`/v1/user/${faker.string.uuid()}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Usuário não encontrado');
    });
  });
});
