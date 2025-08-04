import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsInt,
  IsBoolean,
  IsDate,
  IsNumber,
  IsUUID,
  ValidationOptions,
  MinLength,
  Min,
  Max,
  IsEnum,
  MaxLength,
  IsArray,
  IsUrl,
  IsJSON,
  ValidateNested,
  IsIn,
  IsNotEmpty,
  IsDateString,
  IsObject,
} from 'class-validator';

import GenericErrors from '../core/logic/genericErrors';
import { filledArray } from '../core/utils/undefinedHelpers';

/**
 * Valida se o valor é uma string com opção de trim.
 */
export function ValidatedString(
  name: string,
  { trim = true, ...options }: ValidationOptions & { trim?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsString({ message: `${name} informado deve ser um texto válido`, ...options }),
    trim ? Transform(({ value }) => value?.trim()) : Transform(({ value }) => value),
  );
}

/**
 * Valida se o valor é um e-mail válido.
 */
export function ValidatedEmail(options?: ValidationOptions): PropertyDecorator {
  return IsEmail({}, { message: 'O e-mail informado não é válido.', ...options });
}

/**
 * Valida se o valor é um número inteiro.
 */
export function ValidatedInt(name: string, options?: ValidationOptions): PropertyDecorator {
  return IsInt({ message: `${name} informado deve ser um número inteiro`, ...options });
}

/**
 * Valida se o valor é um número (inteiro ou decimal).
 */
export function ValidatedNumber(name: string, options?: ValidationOptions): PropertyDecorator {
  return IsNumber({}, { message: `${name} informado deve ser um número`, ...options });
}
/**
 * Valida se o valor é um booleano (verdadeiro ou falso).
 * Transforma strings 'true' ou 'false' em boolean true ou false respectivamente.
 * Rejeita qualquer outro valor que não seja um booleano válido.
 */
export function ValidatedBoolean(name: string, options?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsBoolean({ message: `propriedade '${name}' deve ser verdadeiro ou falso`, ...options }),
    Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (typeof value === 'boolean') return value;
      return value; // Retorna o valor original para que IsBoolean possa validar e rejeitar valores inválidos
    }),
  );
}

/**
 * Valida se o valor é uma data válida.
 */
export function ValidatedDate(name: string, options?: ValidationOptions): PropertyDecorator {
  return IsDate({ message: `${name} não é uma data válida`, ...options });
}

/**
 * Valida se o valor é uma data válida no formato string (iso).
 */
export function ValidatedDateString(name: string, options?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsDateString({}, { message: `${name} não é uma data válida`, ...options }),
    Transform(({ value }) => {
      if (!value) return value;
      const date = new Date(value);
      return date.toISOString();
    }),
  );
}

/**
 * Valida se o valor é um UUID (identificador único universal).
 */
export function ValidatedUUID(name?: string, options?: ValidationOptions): PropertyDecorator {
  return IsUUID(undefined, { message: `${name ?? 'id'} informado não é válido`, ...options });
}

/**
 * Valida se o tamanho é maior ou igual ao valor informado.
 */
export function ValidatedMinLength(
  name: string,
  length: number,
  options?: ValidationOptions,
): PropertyDecorator {
  return MinLength(length, {
    message: `${name} informado deve ter pelo menos ${length} caracteres`,
    ...options,
  });
}

/**
 * Valida se o tamanho é menor ou igual ao valor informado.
 */
export function ValidatedMaxLength(
  name: string,
  length: number,
  options?: ValidationOptions,
): PropertyDecorator {
  return MaxLength(length, {
    message: `${name} informado deve ter no máximo ${length} caracteres`,
    ...options,
  });
}

/**
 * Valida se o tamanho  está dentro de um intervalo.
 */
export function ValidatedLengthRange(
  name: string,
  min: number,
  max: number,
  options?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(ValidatedMinLength(name, min, options), ValidatedMaxLength(name, max, options));
}

/**
 * Valida se o valor é maior ou igual ao valor informado.
 */
export function ValidatedMinValue(
  name: string,
  value: number,
  allowEqual = false,
  options?: ValidationOptions,
): PropertyDecorator {
  const validatedValue = allowEqual ? value : value + 0.01;

  const message = `${name} informado deve ser maior ${allowEqual ? 'ou igual a' : 'que'} ${value}`;

  return Min(validatedValue, { message, ...options });
}

/**
 * Valida se o valor é menor ou igual ao valor informado.
 */
export function ValidatedMaxValue(
  name: string,
  value: number,
  allowEqual = false,
  options?: ValidationOptions,
): PropertyDecorator {
  const validatedValue = allowEqual ? value : value - 0.01;

  const message = `${name} informado deve ser menor ${allowEqual ? 'ou igual a' : 'que'} ${value}`;

  return Max(validatedValue, { message, ...options });
}

/**
 * Valida se o valor está dentro de um intervalo.
 */
export function ValidatedRange(
  name: string,
  min: number,
  max: number,
  allowEqual = true,
  options?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ValidatedNumber(name),
    ValidatedMinValue(name, min, allowEqual, options),
    ValidatedMaxValue(name, max, allowEqual, options),
  );
}

/**
 * Valida se o valor é um enum válido.
 */
export function ValidatedEnum(name: string, enumProperty: any, options?: ValidationOptions): PropertyDecorator {
  return IsEnum(enumProperty, {
    message: `${name} precisa ser um dos seguintes valores: ${Object.values(enumProperty).join(', ')}`,
    ...options,
  });
}

/**
 * Valida se o valor é um array com tipo específico.
 */
export function ValidatedArray(name: string, options?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsArray({ message: `${name} deve ser um array`, ...options }),
    Transform(({ value }) => {
      if (!value) return undefined;
      return Array.isArray(value) ? value : String(value).split(',');
    }),
  );
}

/**
 * Valida se o valor é um array de string válido e format para uma string separada por vírgulas.
 */
export function ValidatedIds(name?: string) {
  return applyDecorators(
    ApiPropertyOptional({ type: [String] }),
    ValidatedArray(name ?? 'ids'),
    ValidatedUUID(name ?? 'ids', { each: true }),
    Transform(({ value }) => {
      if (!value) return undefined;
      const array = Array.isArray(value) ? value : String(value).split(',');

      if (!filledArray(array)) {
        throw new GenericErrors.InvalidParam('O array não pode ser vazio');
      }

      return array;
    }),
  );
}

/**
 * Valida se o valor é uma URL válida.
 */
export function ValidatedURL(options?: ValidationOptions): PropertyDecorator {
  return IsUrl(
    {},
    {
      message: 'A URL informada não é válida.',
      ...options,
    },
  );
}

/**
 * Valida se o valor é uma string JSON válida.
 */
export function ValidatedJSON(options?: ValidationOptions): PropertyDecorator {
  return IsJSON({
    message: 'O JSON informado não é válido.',
    ...options,
  });
}

/**
 * Valida se o valor é um dos valores permitidos.
 */
export function ValidatedOneOf<T>(
  name: string,
  values: readonly T[],
  options?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    IsIn(values, {
      message: `${name} deve ser um dos seguintes valores: ${values.join(', ')}`,
      ...options,
    }),
  );
}

/**
 * Valida se o valor foi informado (!== '', !== null, !== undefined).
 */
export function ValidatedIsNotEmpty(name: string, options?: ValidationOptions): PropertyDecorator {
  return IsNotEmpty({
    message: `${name} precisa ser informado`,
    ...options,
  });
}

/**
 * Valida se o objeto aninhado é válido.
 * Combina os decorators ValidateNested e Type para validar objetos aninhados.
 */
export function ValidatedNested(
  classType: new () => any,
  alias?: string,
  options?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    ValidateNested({
      ...options,
    }),
    Type(() => classType),
  );
}

/**
 * Valida se o valor é um objeto válido.
 */
export function ValidatedObject(name: string, options?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsObject({
      message: `${name} deve ser um objeto válido`,
      ...options,
    }),
  );
}
