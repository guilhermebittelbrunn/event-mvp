import {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  IPaymentGateway,
} from '../../paymentGateway.interface';

export class StripePaymentGateway implements IPaymentGateway {
  async createPaymentLink(_: CreatePaymentLinkRequest): Promise<CreatePaymentLinkResponse> {
    throw new Error('not implemented');
  }
}
