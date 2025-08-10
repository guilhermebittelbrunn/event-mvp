import { HttpStatus } from '@nestjs/common';

import { insertFakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { insertFakeEventAccess } from '@/module/event/repositories/tests/entities/fakeEventAccess';
import { request } from '@/shared/test/utils';
import { EventStatusEnum } from '@/shared/types/event/event';

describe('SignInByTokenController (e2e)', () => {
  describe('POST /v1/auth/sign-in-by-token', () => {
    it('should sign in by token successfully', async () => {
      const event = await insertFakeEvent({ status: EventStatusEnum.IN_PROGRESS });
      const eventAccess = await insertFakeEventAccess({ eventId: event.id });

      const result = await request()
        .post('/v1/auth/sign-in-by-token')
        .send({
          token: eventAccess.id,
        })
        .expect(HttpStatus.CREATED);

      expect(result.body.data.event.id).toBeDefined();
      expect(result.body.data.token.access_token).toBeDefined();
      expect(result.body.data.token.expires_in).toBeDefined();
    });
  });
});
