import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { EventModel } from '@prisma/client';
import { isEmpty } from 'class-validator';

import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import { insertFakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { EventStatusEnum } from '@/shared/types/event/event';

export function fakeEvent(overrides?: Partial<EventModel>): Event {
  const slug = EventSlug.create(overrides?.slug ?? faker.lorem.slug());
  const status = EventStatus.create((overrides?.status as EventStatusEnum) ?? EventStatusEnum.DRAFT);
  const userId = new UniqueEntityID(overrides?.userId ?? faker.string.uuid());
  const fileId = overrides?.fileId ? new UniqueEntityID(overrides.fileId) : undefined;

  return Event.create(
    {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      startAt: faker.date.recent(),
      endAt: faker.date.future(),
      ...overrides,
      userId,
      slug,
      status,
      fileId,
    },
    UniqueEntityID.create(),
  );
}

export async function insertFakeEvent(overrides: Partial<EventModel> = {}): Promise<EventModel> {
  const event = fakeEvent(overrides);

  if (isEmpty(overrides?.userId)) {
    const user = await insertFakeUser();
    overrides.userId = user.id;
  }

  return prisma.eventModel.create({
    data: {
      id: event.id.toValue(),
      fileId: event.fileId?.toValue(),
      userId: event.userId.toValue(),
      name: event.name,
      slug: event.slug.value,
      status: event.status.value,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      ...overrides,
    },
  });
}
