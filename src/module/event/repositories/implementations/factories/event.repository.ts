import { EventRepository } from '../event.repository';

import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

export const makeEventRepository = () => {
  const prismaService = new PrismaService();
  const als = new Als();

  return new EventRepository(prismaService, als);
};
