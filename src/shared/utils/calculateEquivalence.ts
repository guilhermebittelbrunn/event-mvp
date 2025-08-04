import { roundTwoCases } from './numberHelper';

interface CalculateValueEquivalenceParams {
  remainingTotalValue: number;
  equivalence: number;
  totalToCompare: number;
  isLast: boolean;
}

export default function calculateValueEquivalence({
  remainingTotalValue,
  equivalence,
  totalToCompare,
  isLast,
}: CalculateValueEquivalenceParams): [equivalentValue: number, newRemainingTotalValue: number] {
  let equivalentValue = 0;
  let newRemainingTotalValue = remainingTotalValue;

  if (remainingTotalValue > 0) {
    // valor equivalente que na verdade é algum valor total do pagamento rateado entre todos os itens
    equivalentValue = roundTwoCases(equivalence * totalToCompare);
    if (Number.isNaN(equivalentValue)) equivalentValue = 0;

    // Quando trabalhando com valores pequenos existe a chance do valor total ser
    // alcançado antes de todos itens serem iterados (por conta do arredondamento)
    const remainingTotalValueEndReached = equivalentValue > remainingTotalValue;

    if (isLast || remainingTotalValueEndReached) {
      // se for o último item do array ele pega todo o resto para garantir que não vai ter sobras
      equivalentValue = remainingTotalValue;
    }

    newRemainingTotalValue = roundTwoCases(remainingTotalValue - equivalentValue);
  }

  return [equivalentValue, newRemainingTotalValue];
}
