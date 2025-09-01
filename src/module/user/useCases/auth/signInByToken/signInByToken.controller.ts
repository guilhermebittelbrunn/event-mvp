import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignInByTokenDTO } from './dto/signInByToken.dto';
import { SignInByTokenResponseDTO } from './dto/signInByToken.response.dto';
import { SignInByTokenService } from './signInByToken.service';

import EventMapper from '@/module/event/mappers/event.mapper';
import { ValidatedBody } from '@/shared/decorators';

@Controller('/auth/sign-in-by-token')
@ApiTags('auth')
export class SignInByTokenController {
  constructor(private readonly useCase: SignInByTokenService) {}

  @Post()
  async handle(@ValidatedBody() body: SignInByTokenDTO): Promise<SignInByTokenResponseDTO> {
    const { event, token } = await this.useCase.execute(body);

    return { data: EventMapper.toDTO(event), meta: { token } };
  }
}
