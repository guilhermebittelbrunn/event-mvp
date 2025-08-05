import EventConfig from '@/module/event/domain/eventConfig';
import { IEventConfigRepository } from '@/module/event/repositories/eventConfig.repository.interface';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakeEventConfigRepository
  extends FakeBaseRepository<EventConfig>
  implements IEventConfigRepository {}
