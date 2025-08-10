import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AsyncLocalStorage } from 'async_hooks';

import Event from '@/module/event/domain/event/event';
import User from '@/module/user/domain/user/user';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';

export interface AlsData {
  user?: User;
  event?: Event;
  requestId?: UniqueEntityID;
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >;
}

@Injectable()
export class Als extends AsyncLocalStorage<AlsData> {}
