import type { MathGameMode, MathOperation, Tier } from './types';

export interface MathChallenge {
  prompt: string;
  answer: string;
  operation: MathOperation;
}

export interface GeneratedMathChallenge {
  challenge: MathChallenge;
  randomState: number;
}

const OPERATIONS_BY_TIER: readonly (readonly MathOperation[])[] = [
  ['addition'],
  ['addition', 'subtraction'],
  ['addition', 'subtraction', 'multiplication'],
  ['addition', 'subtraction', 'multiplication', 'division'],
  ['addition', 'subtraction', 'multiplication', 'division', 'fractions'],
];

const MATH_MODE_OPERATIONS: Record<MathGameMode, MathOperation | 'classic'> = {
  math_classic: 'classic',
  math_addition: 'addition',
  math_subtraction: 'subtraction',
  math_multiplication: 'multiplication',
  math_division: 'division',
  math_fractions: 'fractions',
};

const step = (seed: number) => (seed * 1664525 + 1013904223) >>> 0;

const nextInt = (seed: number, minimum: number, maximum: number) => {
  const randomState = step(seed);
  const value = minimum + Math.floor((randomState / 0x100000000) * (maximum - minimum + 1));
  return { value, randomState };
};

const tierValue = <T,>(values: readonly T[], tier: Tier) => values[tier - 1];

const greatestCommonDivisor = (left: number, right: number): number => {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

const reduceFraction = (numerator: number, denominator: number) => {
  const divisor = greatestCommonDivisor(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
};

function createAddition(seed: number, tier: Tier): GeneratedMathChallenge {
  const maximum = tierValue([9, 20, 99, 199, 499], tier);
  const left = nextInt(seed, 1, maximum);
  const right = nextInt(left.randomState, 1, maximum);
  return { challenge: { prompt: `${left.value} + ${right.value} =`, answer: String(left.value + right.value), operation: 'addition' }, randomState: right.randomState };
}

function createSubtraction(seed: number, tier: Tier): GeneratedMathChallenge {
  const maximum = tierValue([9, 20, 99, 199, 499], tier);
  const left = nextInt(seed, 1, maximum);
  const right = nextInt(left.randomState, 0, left.value);
  return { challenge: { prompt: `${left.value} − ${right.value} =`, answer: String(left.value - right.value), operation: 'subtraction' }, randomState: right.randomState };
}

function createMultiplication(seed: number, tier: Tier): GeneratedMathChallenge {
  const maximum = tierValue([5, 8, 10, 12, 15], tier);
  const left = nextInt(seed, 1, maximum);
  const right = nextInt(left.randomState, 1, maximum);
  return { challenge: { prompt: `${left.value} × ${right.value} =`, answer: String(left.value * right.value), operation: 'multiplication' }, randomState: right.randomState };
}

function createDivision(seed: number, tier: Tier): GeneratedMathChallenge {
  const maxDivisor = tierValue([5, 7, 10, 12, 15], tier);
  const maxQuotient = tierValue([8, 12, 20, 30, 50], tier);
  const divisor = nextInt(seed, 2, maxDivisor);
  const quotient = nextInt(divisor.randomState, 1, maxQuotient);
  return { challenge: { prompt: `${divisor.value * quotient.value} ÷ ${divisor.value} =`, answer: String(quotient.value), operation: 'division' }, randomState: quotient.randomState };
}

function createFractions(seed: number, tier: Tier): GeneratedMathChallenge {
  const maximumDenominator = tierValue([4, 6, 8, 10, 12], tier);
  const denominator = nextInt(seed, 2, maximumDenominator);
  const operator = nextInt(denominator.randomState, 0, 1);
  const firstNumerator = nextInt(operator.randomState, 1, Math.max(1, denominator.value - 1));
  const isSubtraction = operator.value === 1 && firstNumerator.value > 1;
  const secondMaximum = !isSubtraction
    ? Math.max(1, denominator.value - firstNumerator.value)
    : Math.max(1, firstNumerator.value - 1);
  const secondNumerator = nextInt(firstNumerator.randomState, 1, secondMaximum);
  const result = !isSubtraction
    ? firstNumerator.value + secondNumerator.value
    : firstNumerator.value - secondNumerator.value;
  const sign = isSubtraction ? '−' : '+';
  return {
    challenge: {
      prompt: `${firstNumerator.value}/${denominator.value} ${sign} ${secondNumerator.value}/${denominator.value} =`,
      answer: reduceFraction(result, denominator.value),
      operation: 'fractions',
    },
    randomState: secondNumerator.randomState,
  };
}

const createForOperation = (operation: MathOperation, seed: number, tier: Tier): GeneratedMathChallenge => {
  if (operation === 'addition') return createAddition(seed, tier);
  if (operation === 'subtraction') return createSubtraction(seed, tier);
  if (operation === 'multiplication') return createMultiplication(seed, tier);
  if (operation === 'division') return createDivision(seed, tier);
  return createFractions(seed, tier);
};

export const isMathGameMode = (mode: string): mode is MathGameMode => Object.hasOwn(MATH_MODE_OPERATIONS, mode);

export const createMathChallenge = (mode: MathGameMode, tier: Tier, seed: number): GeneratedMathChallenge => {
  const selected = MATH_MODE_OPERATIONS[mode];
  if (selected !== 'classic') return createForOperation(selected, seed, tier);
  const operations = OPERATIONS_BY_TIER[tier - 1];
  const choice = nextInt(seed, 0, operations.length - 1);
  return createForOperation(operations[choice.value], choice.randomState, tier);
};
