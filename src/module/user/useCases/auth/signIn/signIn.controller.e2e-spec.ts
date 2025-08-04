import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import UserPassword from '@/module/user/domain/user/userPassword';
import { insertFakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import SignInErrors from '@/module/user/useCases/auth/signIn/signIn.error';
import { request } from '@/shared/test/utils';

describe('SignInController (e2e)', () => {
  describe('POST /v1/auth/sign-in', () => {
    it('should sign in a user successfully', async () => {
      jest.spyOn(UserPassword.prototype, 'compare').mockResolvedValueOnce(true);

      const plainPassword = faker.internet.password();

      const user = await insertFakeUser({ password: plainPassword });

      const result = await request()
        .post('/v1/auth/sign-in')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(HttpStatus.CREATED);

      expect(result.body.data.user.id).toBe(user.id);
      expect(result.body.data.tokens.access_token).toBeDefined();
      expect(result.body.data.tokens.refresh_token).toBeDefined();
    });

    it('should return 404 when user does not exist', async () => {
      const response = await request()
        .post('/v1/auth/sign-in')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(new SignInErrors.NotFoundError().message);
    });

    it('should return 401 when password is incorrect', async () => {
      const { email, password } = await insertFakeUser();

      const response = await request()
        .post('/v1/auth/sign-in')
        .send({
          email,
          password,
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe(new SignInErrors.InvalidCredentials().message);
    });
  });
});
