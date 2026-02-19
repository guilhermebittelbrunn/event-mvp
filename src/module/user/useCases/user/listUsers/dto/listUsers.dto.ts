import { PaginationQuery } from '@/shared/core/infra/pagination.interface';
import { ValidatedEnum } from '@/shared/decorators';
import { UserTypeEnum } from '@/shared/types';

export class ListUsersDTO extends PaginationQuery {
  @ValidatedEnum('tipo de usuário', UserTypeEnum, { each: true })
  types?: UserTypeEnum[];
}
