/** @note Como esse script é executado pelo prisma, ele não converte "paths" do typescript, então sempre use o caminho relativo de import */

import { PrismaClient } from '@prisma/client';

import { getUserSeeding } from './user';

export async function runSeeding(prisma: PrismaClient) {
  console.info('Seeding started...');

  /** User */
  const userSeeding = await getUserSeeding();

  await Promise.all(
    userSeeding.map((user) =>
      prisma.userModel.upsert({
        where: { id: user.id },
        update: {},
        create: user,
      }),
    ),
  );
}
