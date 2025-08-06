import { IsNotEmpty, IsString } from 'class-validator';

export class SignInByTokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
