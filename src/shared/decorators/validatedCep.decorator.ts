import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

const specialCharactersRegex = /\D/g;

@ValidatorConstraint({ name: 'isCep', async: false })
class IsCepConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const cleanedValue = value?.replace(specialCharactersRegex, '');

    (args.object as any)[args.property] = cleanedValue;

    return true;
  }

  defaultMessage() {
    return 'cep informado não é válido';
  }
}

/**
 * Useful to validate and format CEP (Brazilian postal code)
 * @param validationOptions
 */
export function ValidatedCep(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCepConstraint,
    });

    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.replace(specialCharactersRegex, '');
      }
      return value;
    })(object, propertyName);
  };
}
