import { ApiProperty } from '@nestjs/swagger';

import { EventDTO } from '@/module/event/dto/event.dto';

class SignInByTokenToken {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  expiresIn: number;
  @ApiProperty()
  expiresAt: number;
}

export class SignInByTokenResponseDTO {
  @ApiProperty()
  data: EventDTO;

  @ApiProperty()
  meta: {
    token: SignInByTokenToken;
  };
}
