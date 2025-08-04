import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const specialCharactersRegex = /\D/g;

@ValidatorConstraint({ name: 'isValidPhone', async: false })
class IsValidPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (typeof value !== 'string') return false;

    const cleanedValue = value.replace(specialCharactersRegex, '');

    return cleanedValue.length >= 10 && cleanedValue.length <= 15;
  }

  defaultMessage() {
    return 'o telefone informado não é válido (formato correto: 11999999999)';
  }
}

/**
 * useful to validate Phone Number and remove special characters
 * @param validationOptions
 */
export function ValidatedPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneConstraint,
    });

    Transform(({ value }) => value.replace(specialCharactersRegex, ''))(object, propertyName);
  };
}
