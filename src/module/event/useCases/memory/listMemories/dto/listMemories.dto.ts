import { MemoryModel } from '@prisma/client';
import { IsUUID } from 'class-validator';

import { PaginationOrderQuery } from '@/shared/core/infra/pagination.interface';
import { ApiUUIDProperty } from '@/shared/infra/docs/swagger/decorators/apiUUIDProperty.decorator';

export class ListMemoriesDTO extends PaginationOrderQuery<MemoryModel> {
  @ApiUUIDProperty()
  @IsUUID()
  eventId: string;
}
