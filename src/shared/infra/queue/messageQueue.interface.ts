import { IUserQueuePayload } from './messageQueue.types';

export enum MessageQueuesEnum {
  USER_CREATED = 'userCreated',
}

export const messageQueuesMap = {
  [MessageQueuesEnum.USER_CREATED]: {
    name: MessageQueuesEnum.USER_CREATED,
    payload: {} as IUserQueuePayload,
  },
} as const;

export interface IMessageQueueService {
  sendMessage<T extends keyof typeof messageQueuesMap>(
    queue: T,
    payload: (typeof messageQueuesMap)[T]['payload'],
    options?: { delaySeconds?: number },
  ): void;
  getPendingMessageCount(queue?: MessageQueuesEnum): Promise<number>;
}

export interface IMessageQueueConsumer {
  handleMessage(payload: any): Promise<void>;
}

export const IMessageQueueServiceSymbol = Symbol('IMessageQueueService');
