import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ProcessPaymentDTO } from './dto/processPayment.dto';
import { ProcessPaymentService } from './processPayment.service';

import { StripeWebhookGuard } from '@/shared/guards/stripeWebhook.guard';

@Controller('/webhook/payment/process-payment')
@UseGuards(StripeWebhookGuard)
export class ProcessPaymentController {
  constructor(private readonly useCase: ProcessPaymentService) {}

  @Post()
  async handle(@Body() body: ProcessPaymentDTO): Promise<void> {
    /** @todo: validate the webhook signature */
    if (body?.data?.object?.id) {
      await this.useCase.execute(body);
    }
  }
}
