import { IBaseRepository } from '@/shared/core/infra/Repository.interface';

export class FakeBaseRepository<Domain> implements IBaseRepository<Domain> {
  create = jest.fn();
  createBulk = jest.fn();
  update = jest.fn();
  updateBulk = jest.fn();
  findAll = jest.fn();
  findById = jest.fn();
  findByIds = jest.fn();
  delete = jest.fn();
  deleteBulk = jest.fn();
  getPaginationParams = jest.fn();
  buildPaginationMeta = jest.fn();
}
