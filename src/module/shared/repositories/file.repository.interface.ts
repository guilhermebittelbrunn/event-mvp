import File from '../domain/file/file';

import { IBaseRepository } from '@/shared/core/infra/repository.interface';

export interface IFileRepository extends IBaseRepository<File> {}

export const IFileRepositorySymbol = Symbol('IFileRepository');
