import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { FileModel } from '@prisma/client';

import { insertFakeMemory } from '@/module/event/repositories/tests/entities/fakeMemory';
import File from '@/module/shared/domain/file/file';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';

export function fakeFile(overrides?: Partial<FileModel>): File {
  return File.create(
    {
      name: faker.string.uuid(),
      path: faker.string.uuid(),
      size: 100,
      url: faker.string.uuid(),
      ...overrides,
      entityId: UniqueEntityID.create(overrides?.entityId ?? faker.string.uuid()),
    },
    new UniqueEntityID(overrides?.id ?? faker.string.uuid()),
  );
}

export async function insertFakeFile(overrides: Partial<FileModel> = {}): Promise<FileModel> {
  const file = fakeFile(overrides);

  if (isEmpty(overrides?.entityId)) {
    const entity = await insertFakeMemory();
    overrides.entityId = entity.id;
  }

  return prisma.fileModel.create({
    data: {
      id: file.id.toValue(),
      entityId: file.entityId.toValue(),
      name: file.name,
      path: file.path,
      url: file.url,
      size: file.size,
      ...overrides,
    },
  });
}
