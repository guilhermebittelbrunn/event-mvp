import { ApiHideProperty, PartialType } from '@nestjs/swagger';

import { UserDTO } from '@/module/user/dto/user.dto';

export class UpdateUserDTO extends PartialType(UserDTO) {
  @ApiHideProperty()
  id: string;
}
