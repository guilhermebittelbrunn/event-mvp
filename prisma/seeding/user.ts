import { UserModel } from '@prisma/client';
import { hash } from 'bcrypt';

import { SALT_ROUNDS } from '../../src/shared/utils/consts';

export const getUserSeeding = async (): Promise<UserModel[]> => [
  {
    id: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
    name: 'admin',
    email: 'admin@example.com',
    type: 'admin',
    password: await hash('102030', SALT_ROUNDS),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 'a0aae11d-b95a-4eb8-be5c-3c4ea95de312',
    name: 'John Doe',
    email: 'john.doe@example.com',
    type: 'common',
    password: await hash('102030', SALT_ROUNDS),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];
