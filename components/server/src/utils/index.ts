export function applyRandomVariance(
  baseValue: number,
  variance: number,
  minRange = 1.0,
) {
  if (variance === 0) {
    return baseValue;
  }

  const range = Math.max(baseValue * variance, minRange);
  const salt = (Math.random() * 2 - 1) * range;

  return baseValue + salt;
}

export function applyRandomVarianceWithJump({
  baseValue,
  variance,
  minValue = 0.01,
  jumpProbability = 0.01,
  jumpFactor = 10,
}: {
  baseValue: number;
  variance: number;
  minValue?: number;
  jumpProbability?: number;
  jumpFactor?: number;
}): number {
  if (variance === 0) {
    return baseValue;
  }

  // Apply normal variance
  const range = baseValue * variance;
  const salt = (Math.random() * 2 - 1) * range;
  let newValue = baseValue + salt;

  // Apply random jump
  if (Math.random() < jumpProbability) {
    const jump = (Math.random() * 2 - 1) * jumpFactor * baseValue;
    newValue += jump;
  }

  return Math.max(newValue, minValue);
}
