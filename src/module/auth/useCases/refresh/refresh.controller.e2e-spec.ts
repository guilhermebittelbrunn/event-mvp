import getAuthenticatedUser, { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('RefreshController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();
  });

  describe('POST /v1/auth/refresh', () => {
    it('should refresh token of a user successfully', async () => {
      const result = await request()
        .post('/v1/auth/refresh')
        .set('refresh-token', `${authInfos.refreshToken}`)
        .send({
          id: authInfos.userId,
        });

      expect(result.body.data.id).toBe(authInfos.userId);
      expect(result.body.meta.tokens.accessToken).toBeDefined();
      expect(result.body.meta.tokens.refreshToken).toBeDefined();
    });
  });
});
