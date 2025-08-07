import File from '@/module/shared/domain/file';
import { IFileRepository } from '@/module/shared/repositories/file.repository.interface';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakeFileRepository extends FakeBaseRepository<File> implements IFileRepository {
  findByEntityId = jest.fn();
  findAllByEntityId = jest.fn();
}
