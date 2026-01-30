import Event from '@/module/event/domain/event/event';

export interface CreatePaymentLinkRequest {
  /** amount in cents */
  amount: number;
  event: Event;
}

export interface CreatePaymentLinkResponse {
  integratorId: string;
  paymentUrl: string;
}

export interface IPaymentGateway {
  createPaymentLink(request: CreatePaymentLinkRequest): Promise<CreatePaymentLinkResponse>;
}

export const IPaymentGatewaySymbol = Symbol('IPaymentGateway');
