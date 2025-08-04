import HashValueObject from '@/shared/core/domain/HashValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard from '@/shared/core/logic/guard';
import { SALT_ROUNDS } from '@/shared/utils';

export interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
}

const MIN_PASSWORD_LENGTH = 6;

export default class UserPassword extends HashValueObject<IUserPasswordProps> {
  public static minLength = MIN_PASSWORD_LENGTH;

  private static userFriendlyName = 'senha';

  protected salt = SALT_ROUNDS;

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public static create(props: IUserPasswordProps): UserPassword {
    const propsResult = Guard.againstNullOrUndefined(props.value, this.userFriendlyName);

    if (!propsResult.succeeded) {
      throw new GenericErrors.InvalidParam(propsResult.message);
    }

    if (!props.hashed) {
      if (!this.isValidLength(props.value)) {
        throw new GenericErrors.InvalidParam(
          `Senha não tem os requisitos mínimos (${MIN_PASSWORD_LENGTH} caracteres).`,
        );
      }
    }

    return new UserPassword({
      value: props.value,
      hashed: !!props.hashed === true,
    });
  }
}
