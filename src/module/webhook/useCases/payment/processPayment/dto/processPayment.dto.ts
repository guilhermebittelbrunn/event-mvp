export class ProcessPaymentDTO {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: {
      id: string;
      object: string;
      api_version: string;
      created: number;
    };
  };
  type:
    | 'checkout.session.completed'
    | 'checkout.session.expired'
    | 'checkout.session.async_payment_succeeded'
    | 'checkout.session.async_payment_failed';
}
