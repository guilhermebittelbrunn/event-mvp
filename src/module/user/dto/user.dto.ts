import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDTO } from '@/shared/core/dto/BaseEntityDTO';
import { UserTypeEnum } from '@/shared/types/user/user';

export class UserDTO extends BaseEntityDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  type: UserTypeEnum;
}
