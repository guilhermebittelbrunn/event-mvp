import { ApiHideProperty } from '@nestjs/swagger';

import { ValidatedEmail, ValidatedString } from '@/shared/decorators/validatedTypes.decorator';
import { UserTypeEnum } from '@/shared/types/user';

export class SignUpDTO {
  @ValidatedString('nome')
  name: string;

  @ValidatedEmail()
  email: string;

  @ValidatedString('senha')
  password: string;

  @ApiHideProperty()
  type?: UserTypeEnum;
}
