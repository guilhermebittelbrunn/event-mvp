import { Decimal } from '@prisma/client/runtime/library';

export function areEqualFloats(num1: number, num2: number) {
  /** When checking float values `!==` operator is misleading */
  return Math.abs(num1 - num2) < Number.EPSILON;
}

export function roundTwoCases(num: number) {
  return +(Math.round(Number(num + 'e+2')) + 'e-2');
}

export function roundCases(num: number, cases: number) {
  return +(Math.round(Number(num + `e+${cases}`)) + `e-${cases}`);
}

/**
 * Recebe um número a ser modificado e outro para definir a quantidade de casas.
 * Preenche as casas adicionando zeros a esquerda.
 */
export function equalQuantityOfCases(num: number, referalNumber: number) {
  return num.toString().padStart(referalNumber.toString().length, '0');
}

export function percentage(num: number, total: number) {
  return Math.floor((num / total) * 100);
}

export function toNumber(num: number | Decimal) {
  return typeof num === 'number' ? num : num.toNumber();
}
