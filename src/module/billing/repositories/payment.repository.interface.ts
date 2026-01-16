import Payment from '../domain/payment/payment';

import { IBaseRepository } from '@/shared/core/infra/repository.interface';

export interface IPaymentRepository extends IBaseRepository<Payment> {}

export const IPaymentRepositorySymbol = Symbol('IPaymentRepository');
