import Event from '@/module/event/domain/event/event';
import { IEventRepository } from '@/module/event/repositories/event.repository.interface';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakeEventRepository extends FakeBaseRepository<Event> implements IEventRepository {
  findCompleteById = jest.fn();
  list = jest.fn();
  findBySlug = jest.fn();
}
