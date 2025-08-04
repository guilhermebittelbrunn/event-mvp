import {
  CreateQueueCommand,
  ListQueuesCommand,
  SQSClient,
  GetQueueAttributesCommand,
} from '@aws-sdk/client-sqs';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'sqs-consumer';
import { Producer } from 'sqs-producer';
import { v4 as uuid } from 'uuid';

import { SQS_CONSUMER_HANDLER, SqsConsumerHandlerOptions } from './consumerHandler.decorator';

import { filledArray } from '@/shared/core/utils/undefinedHelpers';
import { IMessageQueueService, MessageQueuesEnum } from '@/shared/infra/queue/messageQueue.interface';
import { messageQueuesMap } from '@/shared/infra/queue/messageQueue.interface';
import { Als } from '@/shared/services/als/als.interface';

/**
 * Useful links:
 * - https://www.npmjs.com/package/@aws-sdk/client-sqs
 * - https://bbc.github.io/sqs-producer/
 * - https://bbc.github.io/sqs-consumer/
 * - https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_sqs_code_examples.html
 * - https://github.com/ssut/nestjs-sqs/tree/master
 */

type QueueMetadata = {
  name: string;
  url: string;
};

@Injectable()
export class SqsService implements IMessageQueueService, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsService.name);

  private sqsClient: SQSClient;

  private queues = new Map<MessageQueuesEnum, QueueMetadata>();
  private consumers = new Map<MessageQueuesEnum, Consumer>();
  private producers = new Map<MessageQueuesEnum, Producer>();

  constructor(
    private config: ConfigService,
    private discover: DiscoveryService,
    private als: Als,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;

    this.sqsClient = new SQSClient({
      region: this.config.getOrThrow('sqs.region'),
      credentials: {
        accessKeyId: this.config.getOrThrow('sqs.accessKeyId'),
        secretAccessKey: this.config.getOrThrow('sqs.secretAccessKey'),
      },
    });

    await this.syncQueues();

    this.setupProducers();

    await this.setupConsumers();
  }

  async onModuleDestroy() {
    this.close();
  }

  private async syncQueues() {
    try {
      const listCommand = new ListQueuesCommand();

      const listResponse = await this.sqsClient.send(listCommand);

      const prefix = this.config.getOrThrow('sqs.prefix');

      for (const [key, queue] of Object.entries(messageQueuesMap)) {
        const prefixedName = `${prefix}-${queue.name}`;

        const alreadyExistsUrl = listResponse.QueueUrls?.find((url) => url.includes(prefixedName));

        // If some property of the queues is changed, update it manually in the AWS console
        // Since the create queue command does not allow to change a queue that already exists
        if (alreadyExistsUrl) {
          this.queues.set(key as MessageQueuesEnum, {
            name: prefixedName,
            url: alreadyExistsUrl,
          });
        } else {
          this.logger.log(`Creating SQS queue: ${prefixedName}`);

          const createQueueCommand = new CreateQueueCommand({
            QueueName: prefixedName,
            Attributes: {
              ReceiveMessageWaitTimeSeconds: '20', // Long polling
              VisibilityTimeout: '300', // 5 minutes
            },
          });

          const createResponse = await this.sqsClient.send(createQueueCommand);

          this.queues.set(key as MessageQueuesEnum, {
            name: prefixedName,
            url: createResponse.QueueUrl!,
          });
        }
      }

      this.logger.log('SQS queues synchronized with success');
    } catch (error) {
      this.logger.error(`Error initializing SQS queues: ${error}`);

      throw error;
    }
  }

  private setupProducers() {
    try {
      this.logger.log('Producer ~ Creating Producers...');

      this.queues.forEach((queue, key) => {
        if (this.producers.has(key)) {
          this.logger.log(`Producer ~ Producer ${key} already exists!`);
          return;
        }

        const producer = Producer.create({
          queueUrl: queue.url,
          region: this.config.getOrThrow('sqs.region'),
          sqs: this.sqsClient,
        });

        this.producers.set(key, producer);
      });

      this.logger.log('Producer ~ Producers created');
    } catch (error) {
      this.logger.error(`Producer ~ Error Creating Producers: ${error}`);
    }
  }

  private async setupConsumers() {
    try {
      this.logger.log('Consumer ~ Creating Consumers...');

      /** All methods marked by @SqsConsumerHandler decorator */
      const consumersMeta =
        await this.discover.providerMethodsWithMetaAtKey<SqsConsumerHandlerOptions>(SQS_CONSUMER_HANDLER);

      this.queues.forEach((queue, key) => {
        if (this.consumers.has(key)) {
          this.logger.log(`Consumer ~ ${key} already exists!`);
          return;
        }

        const consumerMeta = consumersMeta.find(({ meta }) => meta.queue === key);

        if (!consumerMeta) {
          this.logger.error(`Consumer ~ ${key} does not have a handler!`);
          return;
        }

        const { discoveredMethod } = consumerMeta;

        this.logger.log(
          `Binding handler ${discoveredMethod.parentClass.name}.${discoveredMethod.methodName} to receiver ${queue.name}`,
        );

        const consumerHandler = discoveredMethod.handler.bind(discoveredMethod.parentClass.instance);

        const consumer = Consumer.create({
          queueUrl: queue.url,
          region: this.config.getOrThrow('sqs.region'),
          sqs: this.sqsClient,
          handleMessage: async (message) => {
            return this.als?.run({ requestId: uuid() }, async () => {
              /** @note can be ser other log service in the future */

              this.logger.log(
                `Received message ${message.MessageId} in ${queue.name} with body ${message.Body}`,
              );

              const bodyObject = JSON.parse(message.Body!);
              await consumerHandler(bodyObject);
            });
          },
        });

        this.consumers.set(key, consumer);
      });

      for (const consumer of this.consumers.values()) {
        consumer.start();
      }

      this.logger.log('Consumer ~ Consumers Created');
    } catch (error) {
      this.logger.error(`Consumer ~ Error Creating Consumers: ${error}`);
    }
  }

  private close() {
    this.logger.log('Closing Consumers...');

    for (const consumer of this.consumers.values()) {
      consumer.stop();
    }
  }

  sendMessage<T extends MessageQueuesEnum>(
    queue: T,
    payload: (typeof messageQueuesMap)[T]['payload'],
    options?: { delaySeconds?: number },
  ) {
    const { delaySeconds } = { ...options };
    const producer = this.producers.get(queue);

    if (!producer) {
      this.logger.error(`Producer ${queue} not found, cannot send message`);
      return;
    }

    /** @todo remove log in the future */
    this.logger.log(`Sending message with body ${JSON.stringify(payload)} to ${queue}...`);

    producer.send({
      id: uuid(),
      body: JSON.stringify(payload),
      ...(delaySeconds && { delaySeconds }),
    });
  }

  async getPendingMessageCount(queue?: MessageQueuesEnum): Promise<number> {
    const queues: QueueMetadata[] = [];

    if (!queue) {
      this.queues.forEach((queue) => {
        queues.push(queue);
      });
    } else {
      queues.push(this.queues.get(queue));
    }

    if (!filledArray(queues)) {
      this.logger.error(`Queue(s) not found, cannot get pending message count`);
      return 0;
    }

    let sum = 0;

    try {
      for (const queue of queues) {
        const getQueueAttributesCommand = new GetQueueAttributesCommand({
          QueueUrl: queue.url,
          AttributeNames: [
            'ApproximateNumberOfMessages',
            'ApproximateNumberOfMessagesNotVisible',
            'ApproximateNumberOfMessagesDelayed',
          ],
        });

        const response = await this.sqsClient.send(getQueueAttributesCommand);

        const numberOfMessagesNotVisible = parseInt(
          response.Attributes?.ApproximateNumberOfMessagesNotVisible ?? '0',
          10,
        );
        const numberOfMessagesDelayed = parseInt(
          response.Attributes?.ApproximateNumberOfMessagesDelayed ?? '0',
          10,
        );

        const numberOfMessages = parseInt(response.Attributes?.ApproximateNumberOfMessages ?? '0', 10);

        sum += numberOfMessages + numberOfMessagesNotVisible + numberOfMessagesDelayed;
      }
    } catch (error) {
      this.logger.error(`Error getting pending message count for queue ${queue}: ${error}`);
    }

    return sum;
  }
}
