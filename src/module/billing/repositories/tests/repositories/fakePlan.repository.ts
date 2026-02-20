import { IPlanRepository } from '../../plan.repository.interface';

import Plan from '@/module/billing/domain/plan/plan';
import { FakeBaseRepository } from '@/shared/test/fakeBase.repository';

export class FakePlanRepository extends FakeBaseRepository<Plan> implements IPlanRepository {
  findByType = jest.fn();
  list = jest.fn();
}
