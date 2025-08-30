import { ApiProperty } from '@nestjs/swagger';

import { UserDTO } from '@/module/user/dto/user.dto';

class Token {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken?: string;
  @ApiProperty()
  expiresIn: number;
  @ApiProperty()
  expiresAt: number;
}

export class SignInResponseDTO {
  @ApiProperty()
  user: UserDTO;

  @ApiProperty()
  tokens: Token;
}
