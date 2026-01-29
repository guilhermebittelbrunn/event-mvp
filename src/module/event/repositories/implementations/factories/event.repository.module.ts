import { Module } from '@nestjs/common';

import { IEventRepositorySymbol } from '../../event.repository.interface';
import { IEventAccessRepositorySymbol } from '../../eventAccess.repository.interface';
import { IEventConfigRepositorySymbol } from '../../eventConfig.repository.interface';
import { EventRepository } from '../event.repository';
import { EventAccessRepository } from '../eventAccess.repository';
import { EventConfigRepository } from '../eventConfig.repository';

import { PaymentRepository } from '@/module/billing/repositories/implementations/payment.repository';
import { IPaymentRepositorySymbol } from '@/module/billing/repositories/payment.repository.interface';
import { PrismaModule } from '@/shared/infra/database/prisma/prisma.module';
import { AlsModule } from '@/shared/services/als/als.module';

@Module({
  imports: [PrismaModule, AlsModule],
  providers: [
    {
      provide: IEventConfigRepositorySymbol,
      useClass: EventConfigRepository,
    },
    {
      provide: IEventAccessRepositorySymbol,
      useClass: EventAccessRepository,
    },
    {
      provide: IEventRepositorySymbol,
      useClass: EventRepository,
    },
    {
      provide: IPaymentRepositorySymbol,
      useClass: PaymentRepository,
    },
  ],
  exports: [IEventRepositorySymbol],
})
export class EventRepositoryFactory {}
