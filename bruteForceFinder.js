// utils/bruteForceFinder.js
export const simulateBruteForceFindFake = (coins) => {
  const steps = [];
  let compare = null;
  let fakeCoin = null;

  // Loop through the coins and compare each coin with the others
  for (let i = 0; i < coins.length; i++) {
    for (let j = i + 1; j < coins.length; j++) {
      compare = [i + 1, j + 1]; // Compare Coin[i] with Coin[j]

      const result =
        coins[i].weight === coins[j].weight ? 'same' : 'different';

      // Add each step of the comparison to the steps array
      steps.push({
        compare,
        result,
        stepMessage: `Comparing Coin #${i + 1} with Coin #${j + 1}: ${
          result === 'same' ? 'Same Weight' : 'Different Weight'
        }`,
      });

      if (result === 'different') {
        // If the coins are different, one of them must be the fake coin
        fakeCoin = coins[i].weight === 'light' ? coins[i] : coins[j];
        steps.push({
          final: fakeCoin,
          stepMessage: `🎯 Fake Coin Found: Coin #${fakeCoin.id}`,
        });
        return steps; // Return once the fake coin is found
      }
    }
  }

  return steps;
};
