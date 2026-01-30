import { addMinutes } from 'date-fns';
import Stripe from 'stripe';

import {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  IPaymentGateway,
} from '../../paymentGateway.interface';

const ONE_DAY_IN_MINUTES = 23 * 60 + 59;

export class StripePaymentGateway implements IPaymentGateway {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createPaymentLink({ amount, event }: CreatePaymentLinkRequest): Promise<CreatePaymentLinkResponse> {
    let successUrl = process.env.SUCCESS_EVENT_PAYMENT_URL;

    if (!successUrl) {
      throw new Error('SUCCESS_EVENT_PAYMENT_URL is not set');
    }

    if (successUrl.includes('{eventId}') && event?.id) {
      successUrl = successUrl.replace('{eventId}', event.id.toValue());
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'BRL',
            product_data: {
              name: `Pagamento do Evento: ${event.name}`,
              description: `Pagamento para ativação do evento: ${event.name}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'pt-BR',
      // Cartão de crédito (PIX pode ser adicionado depois se necessário)
      payment_method_types: ['card'],
      success_url: successUrl,
      expires_at: Math.floor(addMinutes(new Date(), ONE_DAY_IN_MINUTES).getTime() / 1000),
      metadata: {
        eventId: event.id.toValue(),
      },
    });

    return { integratorId: session.id, paymentUrl: session.url };
  }
}
