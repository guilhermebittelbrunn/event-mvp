import { IsOptional } from 'class-validator';

import { PaginationOrderDateQuery } from '@/shared/core/infra/pagination.interface';
import { ValidatedArray, ValidatedEnum } from '@/shared/decorators';
import { EventStatusEnum } from '@/shared/types';

export class ListEventsDTO extends PaginationOrderDateQuery {
  @IsOptional()
  @ValidatedEnum('status do evento', EventStatusEnum, { each: true })
  @ValidatedArray('status do evento')
  statuses?: EventStatusEnum[];
}
