import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isDateTimeAfter } from '../utils/dateHelpers';

/**
 * Validador customizado para verificar se uma data está no futuro.
 */
@ValidatorConstraint({ name: 'isFutureTime', async: false })
class IsFutureTimeConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (!(typeof value === 'string')) {
      return false;
    }
    return !isDateTimeAfter(new Date(value), new Date());
  }

  defaultMessage(): string {
    return 'a data e hora informada deve ser no passado.';
  }
}

@ValidatorConstraint({ name: 'isPastTime', async: false })
class IsPastTimeConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return isDateTimeAfter(new Date(value), new Date());
  }

  defaultMessage(): string {
    return 'a data e hora informada deve ser no futuro.';
  }
}
/**
 * useful to validate if a date is in the future
 * @param validationOptions
 */
export function ValidatedFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureTimeConstraint,
    });
  };
}
/**
 * useful to validate if a date is in the future
 * @param validationOptions
 */
export function ValidatedPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPastTimeConstraint,
    });
  };
}
