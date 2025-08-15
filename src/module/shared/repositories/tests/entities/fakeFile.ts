import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { FileModel } from '@prisma/client';

import File from '@/module/shared/domain/file/file';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';

export function fakeFile(overrides?: Partial<FileModel>): File {
  return File.create(
    {
      name: faker.string.uuid(),
      path: faker.string.uuid(),
      size: 100,
      url: faker.string.uuid(),
      ...overrides,
    },
    new UniqueEntityID(overrides?.id ?? faker.string.uuid()),
  );
}

export async function insertFakeFile(overrides: Partial<FileModel> = {}): Promise<FileModel> {
  const file = fakeFile(overrides);

  return prisma.fileModel.create({
    data: {
      id: file.id.toValue(),
      name: file.name,
      path: file.path,
      url: file.url,
      size: file.size,
      ...overrides,
    },
  });
}
