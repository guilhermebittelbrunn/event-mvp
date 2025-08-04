import { teardownPostgresSchema } from './prisma/prisma-test-setup';

export default async function tearDown() {
  await teardownPostgresSchema();
}
