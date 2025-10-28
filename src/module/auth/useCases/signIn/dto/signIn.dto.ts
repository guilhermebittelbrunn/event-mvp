import {
  ValidatedEmail,
  ValidatedMinLength,
  ValidatedString,
} from '@/shared/decorators/validatedTypes.decorator';

export class SignInDTO {
  @ValidatedEmail()
  email: string;

  @ValidatedString('senha')
  @ValidatedMinLength('senha', 6)
  password: string;
}
