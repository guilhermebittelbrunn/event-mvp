import EventAccess from '@/module/event/domain/eventAccess/eventAccess';
import { IEventAccessRepository } from '@/module/event/repositories/eventAccess.repository.interface';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakeEventAccessRepository
  extends FakeBaseRepository<EventAccess>
  implements IEventAccessRepository
{
  saveMany = jest.fn();
  findWithEvent = jest.fn();
}
