import Memory from '@/module/event/domain/memory/memory';
import { IMemoryRepository } from '@/module/event/repositories/memory.repository.interface';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakeMemoryRepository extends FakeBaseRepository<Memory> implements IMemoryRepository {
  findAllByIds = jest.fn();
  findCompleteById = jest.fn();
  listWithFiles = jest.fn();
  findAllForDownload = jest.fn();
}
