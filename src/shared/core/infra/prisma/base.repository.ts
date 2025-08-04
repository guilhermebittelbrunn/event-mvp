// eslint-disable-next-line @typescript-eslint/no-require-imports, import/order, @typescript-eslint/no-unused-vars
/* eslint-disable @typescript-eslint/no-var-requires */
import { Prisma, PrismaClient } from '@prisma/client';

import { PaginationQuery } from '../pagination.interface';
import { IBaseRepository } from '../repository.interface';

import Entity from '@/shared/core/domain/Entity';
import MapperInterface from '@/shared/core/domain/MapperInterface';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';
import { GenericId, RawID, ServerResponseMetaPagination, UpdateFields } from '@/shared/types/common';

type PrismaModel = Exclude<keyof PrismaClient, symbol | `$${string}`>;

function applyDeletedWhere<T>() {
  return {
    get: (target: T, prop: PrismaModel) => {
      if (
        typeof target[prop] === 'function' &&
        ['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(prop)
      ) {
        return async (args) => {
          args = { ...args };
          args.where = { ...(args?.where ?? {}), deletedAt: null };

          return target[prop](args);
        };
      }
      return target[prop];
    },
  };
}

export class BaseRepository<ModelKey extends PrismaModel, Domain extends Entity<any>, Model>
  implements IBaseRepository<Domain>
{
  protected mapper: MapperInterface<Domain, Model>;
  protected usesSoftDelete?: boolean;

  constructor(
    private readonly modelClient: PrismaModel,
    protected readonly prisma: PrismaService,
    private readonly als: Als,
  ) {}

  /**
   * This manager is used for two reasons:
   * - To be able to use with transactions
   * - To be able to consume prisma interface in a more practical way (especially for create/update/delete)
   */
  manager<T extends PrismaModel = ModelKey>(model?: T): PrismaService[T] {
    const tx = this.als.getStore()?.tx;

    const currentModel = model ?? this.modelClient;
    const modelContext = tx ? tx[currentModel] : this.prisma[currentModel];

    if (!modelContext) {
      throw new Error(`ModelKey ${this.modelClient} not found`);
    }

    // this proxy is used to intercept the calls to the prisma methods and add the deleted: false to the where clause
    return new Proxy(modelContext, applyDeletedWhere()) as PrismaService[T];
  }

  async findById(id: GenericId): Promise<Domain | null> {
    const entity = await (this.manager().findUnique as any)({ where: { id: UniqueEntityID.raw(id) } });
    return this.mapper.toDomainOrNull(entity);
  }

  async findByIds(ids: GenericId[]): Promise<Domain[]> {
    const entities = await (this.manager().findMany as any)({
      where: { id: { in: ids.map(UniqueEntityID.raw) } },
    });
    return entities.map(this.mapper.toDomain);
  }

  async findAll(): Promise<Domain[]> {
    const entities = await (this.manager().findMany as any)();
    return entities.map(this.mapper.toDomain);
  }

  async create(data: Domain): Promise<Domain> {
    const rawRecord = await this.mapper.toPersistence(data);

    const recordSaved = await (this.manager().create as any)({ data: rawRecord });

    return this.mapper.toDomain(recordSaved);
  }

  async createBulk(data: Domain[]): Promise<Domain[]> {
    const rawRecords = await Promise.all(data.map(async (row) => await this.mapper.toPersistence(row)));

    const recordsSaved = await (this.manager().createManyAndReturn as any)({ data: rawRecords });

    return recordsSaved?.map(this.mapper.toDomain);
  }

  async delete(id: GenericId): Promise<boolean> {
    try {
      if (this.usesSoftDelete) {
        return await this.softDelete(id);
      }
      const deleted = await (this.manager().delete as any)({ where: { id: UniqueEntityID.raw(id) } });
      return !!deleted;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // prisma errors code for not found
        if (error.code === 'P2025' || error.code === 'P2016') {
          return false;
        }
      }
      throw error;
    }
  }

  async deleteBulk(ids: GenericId[]): Promise<boolean> {
    try {
      if (this.usesSoftDelete) {
        return await this.softDeleteBulk(ids);
      }
      const deleted = await (this.manager().deleteMany as any)({
        where: { id: { in: ids.map(UniqueEntityID.raw) } },
      });
      return deleted.count === ids.length;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // prisma errors code for not found
        if (error.code === 'P2025' || error.code === 'P2016') {
          return false;
        }
      }
      throw error;
    }
  }

  async update(data: UpdateFields<Domain>): Promise<RawID> {
    const persistence = await this.mapper.toPersistence(data);
    const { id } = await (this.manager().update as any)({
      where: { id: data.id.toValue() },
      data: persistence,
    });
    return id;
  }

  async updateBulk(data: UpdateFields<Domain>[]): Promise<RawID[]> {
    // prisma does not have a bulk update method without raw sql, so we need to do it one by one
    const promises = data.map(async (row) => await this.update(row));
    return Promise.all(promises);
  }

  private async softDelete(id: GenericId): Promise<boolean> {
    const data = await (this.manager().update as any)({
      data: { deleted_at: new Date() },
      where: { id: UniqueEntityID.raw(id) },
    });

    return !!data;
  }

  private async softDeleteBulk(ids: GenericId[]): Promise<boolean> {
    const data = await (this.manager().updateMany as any)({
      data: { deleted_at: new Date() },
      where: { id: { in: ids.map((id) => UniqueEntityID.raw(id)) } },
    });

    return data?.count === ids.length;
  }

  getPaginationParams(query: PaginationQuery) {
    const page = query.page && Number(query.page) > 0 ? Number(query.page) : 1;
    const take = query.limit && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * take;

    return { page, take, skip };
  }

  buildPaginationMeta(total: number, page: number, limit: number): ServerResponseMetaPagination {
    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    };
  }
}
