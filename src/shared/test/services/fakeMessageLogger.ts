import { IMessageLogger } from '@/shared/core/infra/messageLogger/messageLogger.interface';

export class FakeMessageLogger implements IMessageLogger {
  info = jest.fn();
}
