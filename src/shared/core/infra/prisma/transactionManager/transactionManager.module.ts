import { Global, Module } from '@nestjs/common';

import { TransactionManagerService } from './transactionManager.service';

import { PrismaModule } from '../../../../infra/database/prisma/prisma.module';

import { AlsModule } from '@/shared/services/als/als.module';

@Global()
@Module({
  imports: [PrismaModule, AlsModule],
  providers: [TransactionManagerService],
  exports: [TransactionManagerService],
})
export class TransactionManagerModule {}
