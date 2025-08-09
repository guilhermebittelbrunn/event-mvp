import { HttpStatus } from '@nestjs/common';

import { Readable } from 'stream';

import { insertFakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { insertFakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';
import getAuthenticatedUser, { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

const createMockReadableStream = (): Readable => {
  const stream = new Readable({
    read() {
      this.push('mock file content');
      this.push(null);
    },
  });
  return stream;
};

describe('DownloadMemoriesController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();

    jest.spyOn(S3StorageService.prototype, 'getFile').mockResolvedValue(createMockReadableStream());
  });

  describe('POST /v1/memory/download', () => {
    it('should download memories successfully', async () => {
      const memory1 = await insertFakeMemory();
      const memory2 = await insertFakeMemory();

      await insertFakeFile({ entityId: memory1.id });
      await insertFakeFile({ entityId: memory2.id });

      const memories = [memory1, memory2];

      const result = await request()
        .post(`/v1/memory/download`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({
          memoryIds: memories.map(({ id }) => id),
        })
        .expect(HttpStatus.CREATED);

      expect(result.headers['content-type']).toBe('application/zip');
      expect(result.headers['content-disposition']).toBe('attachment; filename="memories.zip"');

      expect(result.body).toBeDefined();
    });
  });
});
