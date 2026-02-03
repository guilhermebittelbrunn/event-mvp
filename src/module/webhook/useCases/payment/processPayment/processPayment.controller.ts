import { Body, Controller, Post } from '@nestjs/common';

import { ProcessPaymentDTO } from './dto/processPayment.dto';
import { ProcessPaymentService } from './processPayment.service';

@Controller('/webhook/payment/process-payment')
// @UseGuards(StripeWebhookGuard)
export class ProcessPaymentController {
  constructor(private readonly useCase: ProcessPaymentService) {}

  @Post()
  async handle(@Body() body: ProcessPaymentDTO): Promise<void> {
    console.log('body', JSON.stringify(body, null, 2));
    /** @todo: validate the webhook signature */
    if (body?.data?.object?.id) {
      await this.useCase.execute(body);
    }
  }
}
