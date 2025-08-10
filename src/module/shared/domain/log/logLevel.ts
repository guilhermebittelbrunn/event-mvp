import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard, { IGuardResult } from '@/shared/core/logic/guard';
import { LogLevelEnum } from '@/shared/types/shared/log';

export interface LogLevelProps {
  value: LogLevelEnum;
}

export default class LogLevel extends ValueObject<LogLevelProps> {
  private static userFriendlyName = 'nível de log';

  private static userFriendlyTypeName = {
    [LogLevelEnum.INFO]: 'Informativo',
    [LogLevelEnum.WARN]: 'Aviso',
    [LogLevelEnum.ERROR]: 'Erro',
  };

  private constructor(value: LogLevelProps) {
    super(value);
  }

  get value(): LogLevelEnum {
    return this.props.value;
  }

  private static isValid(type: string): IGuardResult {
    const validOptions = Object.values(LogLevelEnum);
    return Guard.isOneOf(type, validOptions, this.userFriendlyName);
  }

  public static getFriendlyTypeName(value: LogLevelEnum): string {
    return this.userFriendlyTypeName[value];
  }

  public static create(type: LogLevelEnum): LogLevel {
    const guardResult = Guard.againstNullOrUndefined(type, this.userFriendlyName);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const isValid = this.isValid(type);

    if (!isValid.succeeded) {
      throw new GenericErrors.InvalidParam(isValid.message);
    }

    return new LogLevel({ value: type });
  }
}
