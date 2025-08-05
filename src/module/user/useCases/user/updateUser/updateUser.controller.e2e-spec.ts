import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import UpdateUserErrors from './updateUser.error';

import { insertFakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import getAuthenticatedUser from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('UpdateUserController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('PUT /v1/user/update', () => {
    it('should update a user successfully', async () => {
      const user = await insertFakeUser();
      const newName = faker.person.fullName();

      const result = await request()
        .put(`/v1/user/${user.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({
          name: newName,
        })
        .expect(HttpStatus.OK);

      const updatedUser = await prisma.userModel.findUnique({
        where: {
          id: user.id,
        },
      });

      expect(result.body.data.id).toBe(user.id);
      expect(updatedUser.name).toBe(newName);
    });

    it('should return 409 when new email is already in use', async () => {
      const user = await insertFakeUser();
      const conflictingUser = await insertFakeUser();

      const response = await request()
        .put(`/v1/user/${user.id}`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({
          email: conflictingUser.email,
        })
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe(new UpdateUserErrors.EmailAlreadyInUse(conflictingUser.email).message);
    });
  });
});
