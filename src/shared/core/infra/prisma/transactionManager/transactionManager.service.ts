import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infra/database/prisma/prisma.service';

import ITransactionManager from '@/shared/core/infra/TransactionManager.interface';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class TransactionManagerService implements ITransactionManager {
  constructor(
    private readonly als: Als,
    private readonly prisma: PrismaService,
  ) {}

  run<T = any>(cb: () => T | Promise<T>, options?: { timeout?: number }) {
    return this.prisma.$transaction(
      async (tx) => {
        this.als.enterWith({
          ...this.als.getStore(),
          tx,
        });

        return cb();
      },
      {
        timeout: options?.timeout ?? 120000, // 2 minutes
      },
    );
  }
}
