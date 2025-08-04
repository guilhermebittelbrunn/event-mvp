import { HttpStatus } from '@nestjs/common';

import { request } from '@/shared/test/utils';

describe('AppController (e2e)', () => {
  it('/health-check (GET)', async () => {
    const response = await request().get('/health-check').expect(HttpStatus.OK);

    expect(response.body.data.message).toContain('Server running');
  });
});
