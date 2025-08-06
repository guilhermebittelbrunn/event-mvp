import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignInDTO } from './dto/signIn.dto';
import { SignInResponseDTO } from './dto/signIn.response.dto';
import { SignInService } from './signIn.service';

import UserMapper from '@/module/user/mappers/user.mapper';
import { ValidatedBody } from '@/shared/decorators';

@Controller('/auth/sign-in')
@ApiTags('auth')
export class SignInController {
  constructor(private readonly useCase: SignInService) {}

  @Post()
  async handle(@ValidatedBody() body: SignInDTO): Promise<SignInResponseDTO> {
    const { user, tokens } = await this.useCase.execute(body);

    return {
      tokens,
      user: UserMapper.toDTO(user),
    };
  }
}
