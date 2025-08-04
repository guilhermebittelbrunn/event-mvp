import { PaginationQuery } from './pagination.interface';

import { GenericId, RawID, ServerResponseMetaPagination, UpdateFields } from '@/shared/types/common';

export type SingleEntityResponse<T> = Promise<T | null> | T | null;

export type MultiEntityResponse<T> = Promise<T[]> | T[];

export interface IBaseRepository<Domain> {
  findById(id: GenericId): SingleEntityResponse<Domain>;
  findByIds(ids: GenericId[]): MultiEntityResponse<Domain>;
  findAll(): MultiEntityResponse<Domain>;
  createBulk(data: Domain[]): MultiEntityResponse<Domain>;
  create(data: Domain): SingleEntityResponse<Domain>;
  update(data: UpdateFields<Domain>): Promise<RawID>;
  updateBulk(data: UpdateFields<Domain>[]): Promise<RawID[]>;
  delete(id: GenericId): Promise<boolean>;
  deleteBulk(ids: GenericId[]): Promise<boolean>;
  getPaginationParams(query: PaginationQuery): { page: number; take: number; skip: number };
  buildPaginationMeta(total: number, page: number, limit: number): ServerResponseMetaPagination;
}
