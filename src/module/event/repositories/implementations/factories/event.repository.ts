import { EventRepository } from '../event.repository';
import { EventAccessRepository } from '../eventAccess.repository';
import { EventConfigRepository } from '../eventConfig.repository';

import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

export const makeEventRepository = () => {
  const prismaService = new PrismaService();
  const als = new Als();

  const eventConfigRepo = new EventConfigRepository(prismaService, als);
  const eventAccessRepo = new EventAccessRepository(prismaService, als);

  return new EventRepository(eventConfigRepo, eventAccessRepo, prismaService, als);
};
