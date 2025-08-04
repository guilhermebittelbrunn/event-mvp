import { prisma } from '@database/index';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

import { ITokenPayload, ITokenResponse, UserTypeEnum } from '@/shared/types/user';

export interface IAuthenticatedUserData {
  userId: string;
  access_token: string;
  refresh_token: string;
}

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
});

const jwtRefreshService = new JwtService({
  secret: process.env.JWT_REFRESH_SECRET,
});

async function generateToken(payload: ITokenPayload): Promise<ITokenResponse> {
  return {
    access_token: await jwtService.signAsync(payload),
    refresh_token: await jwtRefreshService.signAsync(payload),
    expires_in: Date.now() + 1000,
    expires_at: Date.now() + 1000,
  };
}

const userId = uuid();

export default async function getAuthenticatedUser(): Promise<IAuthenticatedUserData> {
  const user = await prisma.userModel.upsert({
    where: { id: userId, deletedAt: null },
    update: {},
    create: {
      id: userId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      type: UserTypeEnum.COMMON,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });

  const now = Math.floor(Date.now() / 1000);
  const { access_token, refresh_token } = await generateToken({
    sub: user.id,
    email: user.email,
    type: user.type,
    iat: now,
    exp: now + 60 * 60, // 1 hora de expiração
  });

  return {
    userId: user.id,
    access_token,
    refresh_token,
  };
}
