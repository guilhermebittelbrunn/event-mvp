import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard, { IGuardResult } from '@/shared/core/logic/guard';
import { UserTypeEnum } from '@/shared/types/user/user';

export interface UserTypeProps {
  value: UserTypeEnum;
}

export default class UserType extends ValueObject<UserTypeProps> {
  private static userFriendlyName = 'tipo de transação';

  private static userFriendlyTypeName = {
    [UserTypeEnum.ADMIN]: 'Administrador',
    [UserTypeEnum.COMMON]: 'Comum',
  };

  private constructor(value: UserTypeProps) {
    super(value);
  }

  get value(): UserTypeEnum {
    return this.props.value;
  }

  private static isValid(type: string): IGuardResult {
    const validOptions = Object.values(UserTypeEnum);
    return Guard.isOneOf(type, validOptions, this.userFriendlyName);
  }

  public static getFriendlyTypeName(value: UserTypeEnum): string {
    return this.userFriendlyTypeName[value];
  }

  public static create(type: UserTypeEnum): UserType {
    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: type, argumentName: 'tipo de usuário' }]);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const isValid = this.isValid(type);

    if (!isValid.succeeded) {
      throw new GenericErrors.InvalidParam(isValid.message);
    }

    return new UserType({ value: type });
  }
}
