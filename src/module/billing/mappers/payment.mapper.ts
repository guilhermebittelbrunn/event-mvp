import { PaymentModel } from '@prisma/client';

import Payment from '../domain/payment/payment';
import PaymentIntegrator from '../domain/payment/paymentIntegrator';
import PaymentStatus from '../domain/payment/paymentStatus';
import { PaymentDTO } from '../dto/payment.dto';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { PaymentIntegratorEnum, PaymentStatusEnum } from '@/shared/types';

export interface PaymentModelWithRelations extends PaymentModel {}

class BasePaymentMapper extends Mapper<Payment, PaymentModelWithRelations, PaymentDTO> {
  toDomain(payment: PaymentModelWithRelations): Payment {
    return Payment.create(
      {
        integrator: PaymentIntegrator.create(payment.integrator as PaymentIntegratorEnum),
        status: PaymentStatus.create(payment.status as PaymentStatusEnum),
        integratorId: payment.integratorId,
        amount: payment.amount,
        currency: payment.currency,
        paymentUrl: payment.paymentUrl,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        deletedAt: payment.deletedAt,
      },
      new UniqueEntityID(payment.id),
    );
  }

  toPersistence(payment: Payment): PaymentModel {
    return {
      id: payment.id.toValue(),
      integrator: payment.integrator.value,
      integratorId: payment.integratorId,
      status: payment.status.value,
      amount: payment.amount,
      currency: payment.currency,
      paymentUrl: payment.paymentUrl,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      deletedAt: payment.deletedAt,
    };
  }

  toDTO(payment: Payment): PaymentDTO {
    return {
      id: payment.id.toValue(),
      status: payment.status.value,
      amount: payment.amount,
      currency: payment.currency,
      paymentUrl: payment.paymentUrl,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      deletedAt: payment.deletedAt,
    };
  }
}

const PaymentMapper = new BasePaymentMapper();

export default PaymentMapper;
