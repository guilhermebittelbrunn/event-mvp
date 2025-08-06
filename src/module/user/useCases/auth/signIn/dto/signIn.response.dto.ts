import { ApiProperty } from '@nestjs/swagger';

import { UserDTO } from '@/module/user/dto/user.dto';

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

export class SignInResponseDTO {
  @ApiProperty()
  user: UserDTO;

  @ApiProperty()
  tokens: Token;
}
