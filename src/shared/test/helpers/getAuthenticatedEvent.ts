import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { addDays, subDays } from 'date-fns';
import { v4 as uuid } from 'uuid';

import getAuthenticatedUser from './getAuthenticatedUser';

import { EventAccessTypeEnum, EventStatusEnum } from '@/shared/types/event/event';
import { ITokenPayloadEvent, ITokenResponse } from '@/shared/types/user';

export interface IAuthenticatedEventData {
  eventId: string;
  accessToken: string;
}

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
});

async function generateToken(payload: ITokenPayloadEvent): Promise<ITokenResponse> {
  return {
    accessToken: await jwtService.signAsync({
      sub: payload.sub,
      ...payload,
    }),
    expiresIn: Date.now() + 1000,
    expiresAt: Date.now() + 1000,
  };
}

const eventId = uuid();

export default async function getAuthenticatedEvent(): Promise<IAuthenticatedEventData> {
  const { userId } = await getAuthenticatedUser();

  const event = await prisma.eventModel.upsert({
    where: { id: eventId, deletedAt: null },
    update: {},
    create: {
      id: eventId,
      userId,
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      status: EventStatusEnum.IN_PROGRESS,
      startAt: subDays(new Date(), 1),
      endAt: addDays(new Date(), 1),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });

  const now = Math.floor(Date.now() / 1000);

  const { accessToken } = await generateToken({
    sub: event.id,
    tokenId: event.id,
    type: EventAccessTypeEnum.GUEST,
    slug: event.slug,
    iat: now,
    exp: now + 60 * 60, // 1 hora de expiração
  });

  return {
    eventId: event.id,
    accessToken,
  };
}
