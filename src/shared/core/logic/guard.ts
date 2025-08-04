import UniqueEntityID from '../domain/UniqueEntityID';

import { areEqualDates } from '@/shared/utils/dateHelpers';

export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument<T = unknown> {
  argument: T;
  argumentName: string;
}

export type GuardArgumentCollection<T = unknown> = IGuardArgument<T>[];

export interface DatetimeIntervalDates {
  initialDate: Date;
  endDate: Date;
  initialHour?: Date | null;
  endHour?: Date | null;
}

export default class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (const result of guardResults) {
      if (result.succeeded === false) return result;
    }
    return { succeeded: true };
  }

  public static greaterThan(minValue: number, actualValue: number, argumentName: string): IGuardResult {
    return actualValue > minValue
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${argumentName} deve ser maior que ${minValue}`,
        };
  }

  public static greaterThanBulk(minValue: number, args: GuardArgumentCollection<number>): IGuardResult {
    for (const arg of args) {
      const result = this.greaterThan(minValue, arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }
    return { succeeded: true };
  }

  public static againstAtLeast(numChars: number, text: string): IGuardResult {
    return text.length >= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `O texto deve ter pelo menos ${numChars} caracteres`,
        };
  }

  public static againstAtMost(numChars: number, text: string): IGuardResult {
    return text.length <= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `O texto não deve exceder ${numChars} caracteres`,
        };
  }

  public static againstNullOrUndefined(argument: unknown, argumentName: string): IGuardResult {
    if (
      argument instanceof UniqueEntityID &&
      (argument.toValue() === null || argument.toValue() === undefined)
    ) {
      return { succeeded: false, message: `${argumentName} é obrigatório` };
    }

    if (argument === null || argument === undefined) {
      return { succeeded: false, message: `${argumentName} é obrigatório` };
    }
    return { succeeded: true };
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }
    return { succeeded: true };
  }

  public static isOneOf<T>(value: T, validValues: T[], argumentName: string): IGuardResult {
    const isValid = validValues.includes(value);
    return isValid
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${argumentName} (${value}) não é um dos valores permitidos (${validValues.join(', ')})`,
        };
  }

  public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
    return num >= min && num <= max
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `${argumentName} deve estar entre ${min} e ${max}`,
        };
  }

  public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.succeeded) return numIsInRangeResult;
    }
    return { succeeded: true };
  }

  public static isValidDatetimeInterval(dates: DatetimeIntervalDates): IGuardResult {
    if (dates.initialDate > dates.endDate) {
      return { succeeded: false, message: 'Data inicial não pode ser maior que a data final' };
    }

    if (areEqualDates(dates.initialDate, dates.endDate)) {
      if (dates.initialHour && dates.endHour && dates.initialHour > dates.endHour) {
        return {
          succeeded: false,
          message: 'Data/hora inicial não pode ser maior que a data/hora final',
        };
      }
    }
    return { succeeded: true };
  }
}
