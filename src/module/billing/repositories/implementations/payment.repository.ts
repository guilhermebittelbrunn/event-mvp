import { Injectable } from '@nestjs/common';
import { PaymentModel } from '@prisma/client';

import Payment from '../../domain/payment/payment';
import PaymentMapper from '../../mappers/payment.mapper';
import { IPaymentRepository } from '../payment.repository.interface';

import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';

@Injectable()
export class PaymentRepository
  extends BaseRepository<'paymentModel', Payment, PaymentModel>
  implements IPaymentRepository
{
  mapper = PaymentMapper;
  usesSoftDelete = true;

  constructor(prisma: PrismaService, als: Als) {
    super('paymentModel', prisma, als);
  }
}
