import { IsNotEmpty } from 'class-validator';

import { ValidatedUUID } from '@/shared/decorators';

export class SignInByTokenDTO {
  @IsNotEmpty()
  @ValidatedUUID()
  token: string;
}
