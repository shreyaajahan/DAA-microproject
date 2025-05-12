export function simulateDivideAndFindFake(coins) {
  const steps = [];
  let current = [...coins];

  while (current.length > 1) {
    const groupSize = Math.floor(current.length / 3);
    const left = current.slice(0, groupSize);
    const right = current.slice(groupSize, 2 * groupSize);
    const remaining = current.slice(2 * groupSize);

    const leftWeight = left.reduce(
      (sum, coin) => sum + (coin.weight === 'light' ? 0 : 1),
      0
    );
    const rightWeight = right.reduce(
      (sum, coin) => sum + (coin.weight === 'light' ? 0 : 1),
      0
    );

    let result;
    if (leftWeight < rightWeight) {
      result = 'left';
      current = left;
    } else if (rightWeight < leftWeight) {
      result = 'right';
      current = right;
    } else {
      result = 'equal';
      current = remaining;
    }

    steps.push({
      leftGroup: left,
      rightGroup: right,
      result,
      remaining,
    });
  }

  // Add the final step and keep left/right groups empty to avoid undefined errors
  if (current.length === 1) {
    steps.push({
      leftGroup: [],
      rightGroup: [],
      result: '',
      final: current[0],
    });
  }

  return steps;
}
