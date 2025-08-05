import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { EventConfigModel } from '@prisma/client';

import { insertFakeEvent } from './fakeEvent';

import EventConfig from '@/module/event/domain/eventConfig';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';

export function fakeEventConfig(overrides?: Partial<EventConfigModel>): EventConfig {
  return EventConfig.create(
    {
      ...overrides,
      eventId: UniqueEntityID.create(),
    },
    new UniqueEntityID(overrides?.id ?? faker.string.uuid()),
  );
}

export async function insertFakeEventConfig(
  overrides: Partial<EventConfigModel> = {},
): Promise<EventConfigModel> {
  const eventConfig = fakeEventConfig(overrides);

  if (isEmpty(overrides?.eventId)) {
    const event = await insertFakeEvent();
    overrides.eventId = event.id;
  }

  return prisma.eventConfigModel.create({
    data: {
      id: eventConfig.id.toValue(),
      eventId: eventConfig.eventId.toValue(),
      primaryColor: eventConfig.primaryColor,
      secondaryColor: eventConfig.secondaryColor,
      primaryContrast: eventConfig.primaryContrast,
      secondaryContrast: eventConfig.secondaryContrast,
      backgroundColor: eventConfig.backgroundColor,
      backgroundContrast: eventConfig.backgroundContrast,
      textColorPrimary: eventConfig.textColorPrimary,
      textColorSecondary: eventConfig.textColorSecondary,
      welcomeMessage: eventConfig.welcomeMessage,
      ...overrides,
    },
  });
}
