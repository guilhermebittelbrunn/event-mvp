import File from '../domain/file';

import {
  IBaseRepository,
  MultiEntityResponse,
  SingleEntityResponse,
} from '@/shared/core/infra/repository.interface';
import { GenericId } from '@/shared/types/common';

export interface IFileRepository extends IBaseRepository<File> {
  findByEntityId(entityId: GenericId): SingleEntityResponse<File>;
  findAllByEntityId(entityIds: GenericId[]): MultiEntityResponse<File>;
}

export const IFileRepositorySymbol = Symbol('IFileRepository');
