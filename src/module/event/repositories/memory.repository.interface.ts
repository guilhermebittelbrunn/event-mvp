import { MemoryModel } from '@prisma/client';

import Memory from '../domain/memory/memory';

import { PaginatedResult, PaginationOrderQuery } from '@/shared/core/infra/pagination.interface';
import {
  IBaseRepository,
  MultiEntityResponse,
  SingleEntityResponse,
} from '@/shared/core/infra/repository.interface';
import { GenericId } from '@/shared/types/common';

export interface ListMemoriesWithFilesByQuery extends PaginationOrderQuery<MemoryModel> {
  hidden?: boolean;
}

export interface IMemoryRepository extends IBaseRepository<Memory> {
  findAllByIds(ids: GenericId[]): MultiEntityResponse<Memory>;
  findCompleteById(id: GenericId): SingleEntityResponse<Memory>;
  listWithFiles(eventId: GenericId, query?: ListMemoriesWithFilesByQuery): Promise<PaginatedResult<Memory>>;
  findAllForDownload(ids: GenericId[]): Promise<Memory[]>;
}

export const IMemoryRepositorySymbol = Symbol('IMemoryRepository');
