import Memory from '../domain/memory/memory';

import { PaginatedResult, PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { GenericId } from '@/shared/types/common';

export interface IMemoryRepository extends IBaseRepository<Memory> {
  findCompleteById(id: GenericId): SingleEntityResponse<Memory>;
  listWithFiles(query?: PaginationQuery): Promise<PaginatedResult<Memory>>;
  findAllForDownload(ids: GenericId[]): Promise<Memory[]>;
}

export const IMemoryRepositorySymbol = Symbol('IMemoryRepository');
