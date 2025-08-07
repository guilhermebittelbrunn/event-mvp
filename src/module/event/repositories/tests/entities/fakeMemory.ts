import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { MemoryModel } from '@prisma/client';

import { insertFakeEvent } from './fakeEvent';

import IpAddress from '@/module/event/domain/ipAddress';
import Memory from '@/module/event/domain/memory/memory';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';

export function fakeMemory(overrides?: Partial<MemoryModel>): Memory {
  return Memory.create(
    {
      identifier: faker.string.uuid(),
      description: faker.lorem.sentence(),
      message: faker.lorem.sentence(),
      ...overrides,
      eventId: UniqueEntityID.create(overrides?.eventId ?? faker.string.uuid()),
      ipAddress: IpAddress.create(overrides?.ipAddress ?? faker.internet.ip()),
    },
    new UniqueEntityID(overrides?.id ?? faker.string.uuid()),
  );
}

export async function insertFakeMemory(overrides: Partial<MemoryModel> = {}): Promise<MemoryModel> {
  const memory = fakeMemory(overrides);

  if (isEmpty(overrides?.eventId)) {
    const event = await insertFakeEvent();
    overrides.eventId = event.id;
  }

  return prisma.memoryModel.create({
    data: {
      id: memory.id.toValue(),
      eventId: memory.eventId.toValue(),
      identifier: memory.identifier,
      description: memory.description,
      ipAddress: memory.ipAddress.value,
      message: memory.message,
      ...overrides,
    },
  });
}
