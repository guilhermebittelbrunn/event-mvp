import { MemoryModel } from '@prisma/client';
import { IsOptional, IsUUID } from 'class-validator';

import { PaginationOrderQuery } from '@/shared/core/infra/pagination.interface';
import { ValidatedBoolean } from '@/shared/decorators';
import { ApiUUIDProperty } from '@/shared/infra/docs/swagger/decorators/apiUUIDProperty.decorator';

export class ListMemoriesDTO extends PaginationOrderQuery<MemoryModel> {
  @ApiUUIDProperty()
  @IsUUID()
  eventId: string;

  @IsOptional()
  @ValidatedBoolean('ocultar')
  hidden?: boolean;
}
