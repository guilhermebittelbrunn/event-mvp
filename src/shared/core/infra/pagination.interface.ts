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

export class PaginationOrderQuery<T extends object = object> extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  orderBy?: keyof T;

  @ApiPropertyOptional()
  @IsOptional()
  order?: 'asc' | 'desc';
}

export class GenericDateQuery<T extends object = object> {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dateType?: keyof T;
}

export class PaginationOrderDateQuery<T extends object = object> extends PaginationOrderQuery<
  GenericDateQuery<T>
> {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  dateType?: keyof T;
}
