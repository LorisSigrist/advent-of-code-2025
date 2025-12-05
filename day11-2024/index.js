import fs from "node:fs/promises";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const stones = input.split(" ").map(Number);

// Every single digit number cylcles into other single digits
// Most numbers quickly converge onto other known numbers
// once a number has a power-of-2 number of digits, it splits into single digits

// Idea:
// For each number you encounter - build a graph of which numbers each number decays into

// Then, incrementally flood-fill the graph & keep track of how many digits the nodes have after n digits.

// 0 - 3 iterations
// 1
// 2024
// 20 24
// 2 0 2 4

// 1 - 3 iterations
// 2024
// 20 24
// 2 0 2 4

// 2  - 3 iterations
// 4048
// 40 48
// 4 0 4 8

// 3 - 3 iterations
// 6072
// 60 72
// 6 0 7 2

// 4 - 3 iterations
// 8096
// 80 96
// 8 0 9 6

// 5 - 5 iterations
// 10120
// 20482880
// 2048 2880
// 20 48 28 80
// 2 0 4 8 2 8 8 0

// 6 - 5 iterations
// 12144
// 24579456
// 2457 9456
// 24 57 94 56
// 2 4 5 7 9 4 5 6

// 7 - 5 iterations
// 14168
// 28676032
// 2867 6032
// 28 67 60 32
// 2 8 6 7 6 0 3 2

// 8 - 5 iterations
// 16192
// 32772608
// 3277 2608
// 32 77 26 08
// 3 2 7 7 2 6 0 8

// 9 - 5 iterations
// 18216
// 36869184
// 3686 9184
// 36 86 91 84
// 3 6 8 6 9 1 8 4

/**
 * Keeps track of how many stones the given number decays into, after n steps
 * @type {Map<number, number[]>}
 */
const stonesAfterIterations = new Map();

/**
 *
 * @param {number} number
 * @param {number} iteration
 * @returns {number}
 */
function expolore(number, iteration) {
  // check if we've already computed the steps
  const steps = stonesAfterIterations.get(number) ?? [1]; // after 0 iterations, every stone remains as one
  if (steps[iteration]) return steps[iteration];

  // otherwise, explore children
  const stoneString = number.toString();
  const stoneStringLength = stoneString.length;

  let numStones = 0;

  if (number == 0) {
    numStones = expolore(1, iteration - 1);
  } else if (number.toString().length % 2 == 0) {
    const first = Number.parseInt(stoneString.slice(0, stoneStringLength / 2));
    const second = Number.parseInt(stoneString.slice(stoneStringLength / 2));

    numStones = expolore(first, iteration - 1) + expolore(second, iteration - 1);
  } else {
    numStones = expolore(number * 2024, iteration - 1);
  }

  // Update the iteration steps
  steps[iteration] = numStones;
  stonesAfterIterations.set(number, steps);

  // todo: update cache
  return numStones;
}

const NUM_BLINKS = 75;
for (let i = 0; i <= NUM_BLINKS; i++) {
  for (const stone of stones) {
    expolore(stone, i);
  }
}

let sum = 0;
for (const stone of stones) {
  const stepsForStone = stonesAfterIterations.get(stone);
  if (!stepsForStone) throw new Error("");
  sum += stepsForStone[NUM_BLINKS];
}
console.log(sum);
