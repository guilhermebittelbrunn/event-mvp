import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { EventAccessModel } from '@prisma/client';

import { insertFakeEvent } from './fakeEvent';

import EventAccess from '@/module/event/domain/eventAccess/eventAccess';
import EventAccessType from '@/module/event/domain/eventAccess/eventAccessType';
import EventAccessUrl from '@/module/event/domain/eventAccess/eventAccessUrl';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { EventAccessTypeEnum } from '@/shared/types/event/event';

export function fakeEventAccess(overrides?: Partial<EventAccessModel>): EventAccess {
  return EventAccess.create(
    {
      eventId: UniqueEntityID.create(overrides?.eventId ?? undefined),
      url: EventAccessUrl.create(overrides?.url ?? faker.internet.url()),
      type: EventAccessType.create((overrides?.type as EventAccessTypeEnum) ?? EventAccessTypeEnum.GUEST),
    },
    new UniqueEntityID(overrides?.id ?? faker.string.uuid()),
  );
}

export async function insertFakeEventAccess(
  overrides: Partial<EventAccessModel> = {},
): Promise<EventAccessModel> {
  const eventAccess = fakeEventAccess(overrides);

  if (isEmpty(overrides?.eventId)) {
    const event = await insertFakeEvent();
    overrides.eventId = event.id;
  }

  return prisma.eventAccessModel.create({
    data: {
      id: eventAccess.id.toValue(),
      eventId: eventAccess.eventId.toValue(),
      url: eventAccess.url.value,
      type: eventAccess.type.value,
      ...overrides,
    },
  });
}
