import { StripePaymentGateway } from '../implementations/stripe/stripe';
import { IPaymentGateway } from '../paymentGateway.interface';

import { PaymentIntegratorEnum } from '@/shared/types';

export function makePaymentGatewayByType(type: PaymentIntegratorEnum): IPaymentGateway {
  switch (type) {
    case PaymentIntegratorEnum.STRIPE:
      return new StripePaymentGateway();
    default:
      throw new Error(`Payment gateway not found for type: ${type}`);
  }
}
