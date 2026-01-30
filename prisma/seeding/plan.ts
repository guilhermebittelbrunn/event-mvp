import { PlanModel } from '@prisma/client';

export const planSeeding: PlanModel[] = [
  {
    id: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
    type: 'event_basic',
    description: 'Plano básico para evento único',
    price: 200 * 100, // 200 reais
    currency: 'BRL',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];
