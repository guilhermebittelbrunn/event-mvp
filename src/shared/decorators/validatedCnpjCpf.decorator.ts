import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

const specialCharactersRegex = /\D/g;

@ValidatorConstraint({ name: 'isCpf', async: false })
class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (typeof value !== 'string') return false;

    const cleanedValue = value.replace(specialCharactersRegex, '');
    if (cleanedValue.length !== 11) return false;

    (args.object as any)[args.property] = cleanedValue;

    return this.validateCpf(cleanedValue);
  }

  defaultMessage() {
    return 'cpf informado não é válido';
  }

  private validateCpf(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder >= 10) remainder = 0;
    if (remainder !== Number(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder >= 10) remainder = 0;

    return remainder === Number(cpf[10]);
  }
}

@ValidatorConstraint({ name: 'isCnpj', async: false })
class IsCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (typeof value !== 'string') return false;

    const cleanedValue = value.replace(specialCharactersRegex, '');
    if (cleanedValue.length !== 14) return false;

    (args.object as any)[args.property] = cleanedValue;

    return this.validateCnpj(cleanedValue);
  }

  defaultMessage() {
    return 'cnpj informado não é válido';
  }

  private validateCnpj(cnpj: string): boolean {
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const calculateDigit = (cnpj: string, weights: number[]) => {
      const sum = cnpj
        .slice(0, weights.length)
        .split('')
        .reduce((acc, curr, i) => acc + Number(curr) * weights[i], 0);

      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    return (
      calculateDigit(cnpj, weights1) === Number(cnpj[12]) && calculateDigit(cnpj, weights2) === Number(cnpj[13])
    );
  }
}
/**
 * useful to validate CPF and remove special characters
 * @param validationOptions
 */
export function ValidatedCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfConstraint,
    });
  };
}

/**
 * useful to validate CNPJ and remove special characters
 * @param validationOptions
 */
export function ValidatedCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnpjConstraint,
    });
  };
}
