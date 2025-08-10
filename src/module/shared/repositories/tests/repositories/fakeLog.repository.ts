import Log from '@/module/shared/domain/log/log';
import { ILogRepository } from '@/module/shared/repositories/log.repository.interface';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakeLogRepository extends FakeBaseRepository<Log> implements ILogRepository {}
