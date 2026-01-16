/** @note Como esse script é executado pelo prisma, ele não converte "paths" do typescript, então sempre use o caminho relativo de import */

import { PrismaClient } from '@prisma/client';

import { planSeeding } from './plan';
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

  /** Plan */

  await Promise.all(
    planSeeding.map((plan) => prisma.planModel.upsert({ where: { id: plan.id }, update: {}, create: plan })),
  );
}
