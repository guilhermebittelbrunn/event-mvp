import File from '../domain/file';

import { IBaseRepository, SingleEntityResponse } from '@/shared/core/infra/repository.interface';
import { GenericId } from '@/shared/types/common';

export interface IFileRepository extends IBaseRepository<File> {
  findByEntityId(entityId: GenericId): SingleEntityResponse<File>;
}

export const IFileRepositorySymbol = Symbol('IFileRepository');
