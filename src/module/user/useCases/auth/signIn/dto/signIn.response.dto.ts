import { ApiProperty } from '@nestjs/swagger';

import { ISessionUser } from '@/shared/types/user';

class Token {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
  @ApiProperty()
  expires_in: number;
  @ApiProperty()
  expires_at: number;
}

export class AuthResponseDto {
  @ApiProperty()
  user: ISessionUser;

  @ApiProperty()
  tokens: Token;
}
