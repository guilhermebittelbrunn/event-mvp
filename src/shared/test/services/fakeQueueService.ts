import { IMessageQueueService } from '@/shared/infra/queue/messageQueue.interface';

export class FakeQueueService implements IMessageQueueService {
  sendMessage = jest.fn();
  getPendingMessageCount = jest.fn();
}
