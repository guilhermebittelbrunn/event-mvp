import { faker } from '@faker-js/faker';
import { File } from '@nest-lab/fastify-multer';
import { Test, TestingModule } from '@nestjs/testing';

import { ReplaceFileService } from './replaceFile.service';

import { IFileRepositorySymbol } from '@/module/shared/repositories/file.repository.interface';
import { fakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { FakeFileRepository } from '@/module/shared/repositories/tests/repositories/fakeFile.repository';
import { IFileStoreServiceSymbol } from '@/shared/services/fileStore/fileStore.service.interface';
import { FakeFileStoreService } from '@/shared/test/services';

const makeFile = (overrides?: File) => {
  return {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 100,
    ...overrides,
  };
};

describe('ReplaceFileService', () => {
  let service: ReplaceFileService;

  const fileRepoMock = new FakeFileRepository();
  const fileStoreServiceMock = new FakeFileStoreService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplaceFileService,
        {
          provide: IFileRepositorySymbol,
          useValue: fileRepoMock,
        },
        {
          provide: IFileStoreServiceSymbol,
          useValue: fileStoreServiceMock,
        },
      ],
    }).compile();

    service = module.get<ReplaceFileService>(ReplaceFileService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should replace a file successfully', async () => {
    const url = faker.internet.url();
    const file = fakeFile({ url });
    const oldFile = fakeFile({ url: faker.internet.url() });

    fileStoreServiceMock.upload.mockResolvedValueOnce(url);
    fileRepoMock.create.mockResolvedValueOnce(file);
    fileRepoMock.findById.mockResolvedValueOnce(oldFile);

    const result = await service.execute({
      file: makeFile(),
      oldFileId: oldFile.id.toValue(),
    });

    expect(fileRepoMock.findById).toHaveBeenCalledWith(oldFile.id.toValue());
    expect(fileRepoMock.create).toHaveBeenCalled();
    expect(fileStoreServiceMock.upload).toHaveBeenCalled();
    expect(result).toBe(file);
    expect(fileRepoMock.delete).toHaveBeenCalledWith(oldFile.id);
    expect(fileStoreServiceMock.delete).toHaveBeenCalledWith(oldFile.path);
    expect(result.url).toBe(url);
  });

  it('should only upload the new file if no old file is provided', async () => {
    const url = faker.internet.url();
    const file = fakeFile({ url });

    fileStoreServiceMock.upload.mockResolvedValueOnce(url);
    fileRepoMock.create.mockResolvedValueOnce(file);

    const result = await service.execute({
      file: makeFile(),
    });

    expect(fileRepoMock.create).toHaveBeenCalled();
    expect(fileRepoMock.delete).not.toHaveBeenCalled();
    expect(fileStoreServiceMock.upload).toHaveBeenCalled();
    expect(result).toBe(file);
    expect(result.url).toBe(url);
  });
});
