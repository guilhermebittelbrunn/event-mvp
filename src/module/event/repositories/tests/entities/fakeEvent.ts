import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { EventModel } from '@prisma/client';
import { isEmpty } from 'class-validator';

import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import { insertFakeUser } from '@/module/user/repositories/tests/entities/fakeUser';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { EventStatusEnum } from '@/shared/types/user/event';

export function fakeEvent(overrides?: Partial<EventModel>): Event {
  const slug = EventSlug.create(overrides?.slug ?? faker.lorem.slug());
  const status = EventStatus.create((overrides?.status as EventStatusEnum) ?? EventStatusEnum.DRAFT);
  const userId = new UniqueEntityID(overrides?.userId ?? faker.string.uuid());

  return Event.create(
    {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      start_at: faker.date.recent(),
      end_at: faker.date.future(),
      ...overrides,
      userId,
      slug,
      status,
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
      userId: event.userId.toValue(),
      name: event.name,
      slug: event.slug.value,
      status: event.status.value,
      description: event.description,
      start_at: event.start_at,
      end_at: event.end_at,
      ...overrides,
    },
  });
}
