import { Inject, Injectable } from '@nestjs/common';

import { CreatePaymentDTO } from './dto/createPayment.dto';

import Payment from '@/module/billing/domain/payment/payment';
import PaymentStatus from '@/module/billing/domain/payment/paymentStatus';
import {
  IPaymentRepository,
  IPaymentRepositorySymbol,
} from '@/module/billing/repositories/payment.repository.interface';
import { makePaymentGatewayByType } from '@/shared/infra/paymentGateway/factories/paymentGateway';
import { PaymentIntegratorEnum, PaymentStatusEnum } from '@/shared/types';

@Injectable()
export class CreatePaymentService {
  constructor(@Inject(IPaymentRepositorySymbol) private readonly paymentRepository: IPaymentRepository) {}

  async execute({ amount }: CreatePaymentDTO) {
    const paymentGateway = makePaymentGatewayByType(PaymentIntegratorEnum.STRIPE);

    const { integratorId, paymentUrl } = await paymentGateway.createPaymentLink({ amount });

    const payment = Payment.create({
      amount,
      paymentUrl,
      integratorId,
      status: PaymentStatus.create(PaymentStatusEnum.PENDING),
    });

    return this.paymentRepository.create(payment);
  }
}
