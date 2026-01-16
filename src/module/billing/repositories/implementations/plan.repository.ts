import { Injectable } from '@nestjs/common';
import { PlanModel } from '@prisma/client';

import Plan from '../../domain/plan/plan';
import PlanMapper from '../../mappers/plan.mapper';
import { IPlanRepository } from '../plan.repository.interface';

import { BaseRepository } from '@/shared/core/infra/prisma/base.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { Als } from '@/shared/services/als/als.interface';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

@Injectable()
export class PlanRepository extends BaseRepository<'planModel', Plan, PlanModel> implements IPlanRepository {
  mapper = PlanMapper;
  usesSoftDelete = true;

  constructor(prisma: PrismaService, als: Als) {
    super('planModel', prisma, als);
  }

  async findByType(type: PlanTypeEnum) {
    const plan = await this.manager().findUnique({
      where: { type },
    });

    return this.mapper.toDomainOrNull(plan);
  }
}
