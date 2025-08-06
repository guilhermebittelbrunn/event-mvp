import { ApiProperty } from '@nestjs/swagger';

import { EventDTO } from '@/module/event/dto/event.dto';

class SignInByTokenToken {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  expires_in: number;
  @ApiProperty()
  expires_at: number;
}

export class SignInByTokenResponseDTO {
  @ApiProperty()
  event: EventDTO;

  @ApiProperty()
  token: SignInByTokenToken;
}
