import { Inject, Injectable } from '@nestjs/common';

import { CreatePaymentDTO } from './dto/createPayment.dto';

import Payment from '@/module/billing/domain/payment/payment';
import PaymentStatus from '@/module/billing/domain/payment/paymentStatus';
import {
  IPaymentRepository,
  IPaymentRepositorySymbol,
} from '@/module/billing/repositories/payment.repository.interface';
import {
  IPlanRepository,
  IPlanRepositorySymbol,
} from '@/module/billing/repositories/plan.repository.interface';
import { makePaymentGatewayByType } from '@/shared/infra/paymentGateway/factories/paymentGateway';
import { PaymentIntegratorEnum, PaymentStatusEnum } from '@/shared/types';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

@Injectable()
export class CreatePaymentService {
  constructor(
    @Inject(IPaymentRepositorySymbol) private readonly paymentRepository: IPaymentRepository,
    @Inject(IPlanRepositorySymbol) private readonly planRepository: IPlanRepository,
  ) {}

  async execute({ event }: CreatePaymentDTO) {
    if (!event) {
      return null;
    }

    /** @todo: validate the enum by the payload, for now is hardcoded because this service only will work with the event basic plan */
    const plan = await this.planRepository.findByType(PlanTypeEnum.EVENT_BASIC);

    if (!plan || !plan.price || plan.price <= 0) {
      return null;
    }

    const paymentGateway = makePaymentGatewayByType(PaymentIntegratorEnum.STRIPE);

    const { integratorId, paymentUrl } = await paymentGateway.createPaymentLink({ amount: plan.price, event });

    const payment = Payment.create({
      planId: plan.id,
      amount: plan.price,
      paymentUrl,
      integratorId,
      status: PaymentStatus.create(PaymentStatusEnum.PENDING),
    });

    return this.paymentRepository.create(payment);
  }
}
