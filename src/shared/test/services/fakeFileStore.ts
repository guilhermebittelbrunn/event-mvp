import { IFileStoreService } from '@/shared/services/fileStore/fileStore.service.interface';

export class FakeFileStoreService implements IFileStoreService {
  upload = jest.fn();
  delete = jest.fn();
  deleteBulk = jest.fn();
  getFile = jest.fn();
}
