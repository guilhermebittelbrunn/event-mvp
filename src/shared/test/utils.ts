import * as supertest from 'supertest';

import { app } from './setup';

export function request() {
  return supertest(app.getHttpServer());
}
