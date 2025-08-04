import { PrismaClient } from '@prisma/client';

import { runSeeding } from './seeding';

const prisma = new PrismaClient();

async function run() {
  try {
    await runSeeding(prisma);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
