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

export class RefreshResponseDTO {
  @ApiProperty()
  data: UserDTO;

  @ApiProperty()
  meta: {
    tokens: Token;
  };
}
