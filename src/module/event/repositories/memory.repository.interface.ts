import Memory from '../domain/memory/memory';

import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';

export interface IMemoryRepository extends IBaseRepository<Memory> {
  findCompleteById(id: string): SingleEntityResponse<Memory>;
  listWithFiles(query?: PaginationQuery): Promise<PaginatedResult<Memory>>;
}

export const IMemoryRepositorySymbol = Symbol('IMemoryRepository');
