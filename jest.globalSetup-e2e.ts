import { setupPostgresSchema } from './prisma/prisma-test-setup';

export default async function setup() {
  await setupPostgresSchema();
}
