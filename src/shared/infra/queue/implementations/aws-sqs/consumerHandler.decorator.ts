import { SetMetadata, applyDecorators } from '@nestjs/common';

import { MessageQueuesEnum } from '@/shared/infra/queue/messageQueue.interface';

export interface SqsConsumerHandlerOptions {
  queue: MessageQueuesEnum;
}

export const SQS_CONSUMER_HANDLER = Symbol('SQS_CONSUMER_HANDLER');

export const SqsConsumerHandler = (options: SqsConsumerHandlerOptions) =>
  applyDecorators(SetMetadata(SQS_CONSUMER_HANDLER, options));
