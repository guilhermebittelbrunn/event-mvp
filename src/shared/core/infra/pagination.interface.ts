import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ServerResponseMetaPagination } from '@/shared/types/common';

export interface PaginatedData<T> {
  data: T[];
  meta: ServerResponseMetaPagination;
}

export type PaginatedResult<T> = Promise<PaginatedData<T>> | PaginatedData<T>;

export class PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  term?: string;
}

export class GenericPaginationFilterQuery extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
