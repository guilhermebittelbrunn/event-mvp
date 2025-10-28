import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import SignUpErrors from './signUp.error';

import { fakeUser, insertFakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import { request } from '@/shared/test/utils';
import { UserTypeEnum } from '@/shared/types/user';

describe('SignUpController (e2e)', () => {
  describe('POST /v1/auth/sign-up', () => {
    it('should sign up a user successfully', async () => {
      const user = fakeUser();

      const payload = {
        name: user.name,
        email: user.email.value,
        password: user.password.value,
        type: user.type.value,
      };

      const result = await request().post('/v1/auth/sign-up').send(payload).expect(HttpStatus.CREATED);

      expect(result.body.data.name).toBe(user.name);
      expect(result.body.data.email).toBe(user.email.value);
      expect(result.body.data.type).toBe(user.type.value);
      expect(result.body.data.password).toBeUndefined();
    });

    it('should return 409 when user already exists', async () => {
      const user = await insertFakeUser();

      const payload = {
        name: faker.person.fullName(),
        email: user.email,
        password: faker.internet.password(),
        type: UserTypeEnum.COMMON,
      };

      const response = await request().post('/v1/auth/sign-up').send(payload).expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe(new SignUpErrors.EmailAlreadyInUse(user.email).message);
    });
  });
});
