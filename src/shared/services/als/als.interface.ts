import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { AsyncLocalStorage } from 'async_hooks';

import User from '@/module/user/domain/user/user';

export interface AlsData {
  user?: User;
  requestId?: string;
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >;
}

@Injectable()
export class Als extends AsyncLocalStorage<AlsData> {}
