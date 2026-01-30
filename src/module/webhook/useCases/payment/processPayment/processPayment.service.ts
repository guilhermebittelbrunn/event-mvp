import { Inject, Injectable } from '@nestjs/common';

import { ProcessPaymentDTO } from './dto/processPayment.dto';

import PaymentStatus from '@/module/billing/domain/payment/paymentStatus';
import EventStatus from '@/module/event/domain/event/eventStatus';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { EventStatusEnum, PaymentStatusEnum } from '@/shared/types';

@Injectable()
export class ProcessPaymentService {
  constructor(@Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository) {}

  async execute(dto: ProcessPaymentDTO) {
    const event = await this.eventRepo.findByPaymentIntegratorId(dto.data.object.id);

    if (!event) {
      throw new GenericErrors.NotFound('Evento não encontrado');
    }

    let newEventStatus: EventStatusEnum | undefined;
    let newPaymentStatus: PaymentStatusEnum | undefined;

    switch (dto.type) {
      case 'checkout.session.completed':
        newEventStatus = EventStatusEnum.PUBLISHED;
        newPaymentStatus = PaymentStatusEnum.APPROVED;
        break;
      case 'checkout.session.expired':
        newEventStatus = EventStatusEnum.CANCELLED;
        newPaymentStatus = PaymentStatusEnum.EXPIRED;
        break;
      case 'checkout.session.async_payment_succeeded':
        newEventStatus = EventStatusEnum.PUBLISHED;
        newPaymentStatus = PaymentStatusEnum.APPROVED;
        break;
      case 'checkout.session.async_payment_failed':
        newEventStatus = EventStatusEnum.PENDING_PAYMENT;
        newPaymentStatus = PaymentStatusEnum.REJECTED;
        break;
    }

    if (newEventStatus && newEventStatus !== event.status.value) {
      event.status = EventStatus.create(newEventStatus);
      event.payment.status = PaymentStatus.create(newPaymentStatus);

      await this.eventRepo.update(event);
    }
  }
}
