export interface CreatePaymentLinkRequest {
  /** amount in cents */
  amount: number;
}

export interface CreatePaymentLinkResponse {
  integratorId: string;
  paymentUrl: string;
}

export interface IPaymentGateway {
  createPaymentLink(request: CreatePaymentLinkRequest): Promise<CreatePaymentLinkResponse>;
}

export const IPaymentGatewaySymbol = Symbol('IPaymentGateway');
