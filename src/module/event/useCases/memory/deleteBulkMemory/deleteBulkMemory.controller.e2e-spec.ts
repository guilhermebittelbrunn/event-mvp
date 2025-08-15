import { prisma } from '@database/index';
import { HttpStatus } from '@nestjs/common';

import { insertFakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import { insertFakeFile } from '@/module/shared/repositories/tests/entities/fakeFile';
import { S3StorageService } from '@/shared/services/fileStore/implementations/aws-s3/s3-storage.service';
import getAuthenticatedUser, { IAuthenticatedUserData } from '@/shared/test/helpers/getAuthenticatedUser';
import { request } from '@/shared/test/utils';

describe('DeleteBulkMemoryController (e2e)', () => {
  let authInfos: IAuthenticatedUserData;

  beforeAll(async () => {
    authInfos = await getAuthenticatedUser();

    jest.spyOn(S3StorageService.prototype, 'deleteBulk').mockResolvedValue(undefined);
  });

  describe('POST /v1/memory', () => {
    it('should delete a memory successfully', async () => {
      const memory1 = await insertFakeMemory();
      const memory2 = await insertFakeMemory();

      await request()
        .post(`/v1/memory/delete-bulk`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({
          memoryIds: [memory1.id, memory2.id],
        })
        .expect(HttpStatus.NO_CONTENT);

      const deletedMemory = await prisma.memoryModel.findMany({
        where: {
          id: {
            in: [memory1.id, memory2.id],
          },
        },
      });

      expect(deletedMemory).toHaveLength(0);
    });

    it('should delete multiple memories with files successfully', async () => {
      const file1 = await insertFakeFile();
      const file2 = await insertFakeFile();

      const memory1 = await insertFakeMemory({ fileId: file1.id });
      const memory2 = await insertFakeMemory({ fileId: file2.id });

      await request()
        .post(`/v1/memory/delete-bulk`)
        .set('authorization', `Bearer ${authInfos.access_token}`)
        .send({
          memoryIds: [memory1.id, memory2.id],
        })
        .expect(HttpStatus.NO_CONTENT);

      const deletedMemory = await prisma.memoryModel.findMany({
        where: {
          id: {
            in: [memory1.id, memory2.id],
          },
        },
      });

      const deletedFile = await prisma.fileModel.findMany({
        where: {
          id: {
            in: [file1.id, file2.id],
          },
        },
      });

      expect(deletedMemory).toHaveLength(0);
      expect(deletedFile).toHaveLength(0);
    });
  });
});
