import fs from "node:fs/promises";
import { sum } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline

const LIGHTS_REGEX = /\[.*\]/;
const BUTTONS_REGEX = /\([^)]*\)/g;
const JOLTAGE_REGEX = /{.*}/;

/**
 * @typedef {object} Circuit
 * @property {string} lights
 * @property {number[][]} buttons
 * @property {number[]} joltage
 */

/**
 * @param {string} string
 * @returns Circuit
 */
function parseLine(string) {
  const lightsMatch = string.match(LIGHTS_REGEX);
  const buttonsMatches = string.matchAll(BUTTONS_REGEX);
  const joltageMatch = string.match(JOLTAGE_REGEX);

  const lights = lightsMatch[0]?.slice(1, -1);
  let buttons = [];
  for (const buttonMatch of buttonsMatches) {
    const button = buttonMatch[0].slice(1, -1).split(",").map(Number);
    buttons.push(button);
  }

  const joltage = joltageMatch[0].slice(1, -1).split(",").map(Number);
  return {
    lights,
    buttons,
    joltage,
  };
}

/**
 * @param {Circuit} circuit
 */
function minimumNumberOfPressesToTurnOn(circuit) {
  const lights = circuit.lights.split("").map((c) => c == "#");
  let minAssignment = Number.POSITIVE_INFINITY;

  // Fuck it, brute force
  const options = binaryArrays(circuit.buttons.length);

  for (const option of options) {
    const state = new Array(lights.length).fill(false);

    for (let i = 0; i < option.length; i++) {
      if (option[i] == 0) continue; // only activate when 1

      const button = circuit.buttons[i];
      for (const idx of button) {
        state[idx] = !state[idx];
      }
    }

    // loop over the state to see if it matches the lights
    let matches = true;
    for (let i = 0; i < lights.length; i++) {
      if (state[i] != lights[i]) {
        matches = false;
        break;
      }
    }

    // if it matches, does it use fewer buttons?
    if (matches) {
      const numButtons = option.reduce((prev, acc) => acc + prev, 0);
      if (numButtons < minAssignment) {
        minAssignment = numButtons;
      }
    }
  }

  if (minAssignment == Number.POSITIVE_INFINITY) {
    throw new Error("No assignemtn found");
  }

  return minAssignment;
}

/**
 * @param {Circuit} circuit
 * @return {number}
 */
function minimumNumberOfPressesToMatchJoltage(circuit) {
  let minPresses = Number.MAX_SAFE_INTEGER;

  /**
   * @param {number[]} remainingPresses
   * @param {number[]} button
   * @returns {number[]}
   */
  function remainingPressesAfterButtonPress(remainingPresses, button) {
    const newRemainingPresses = [...remainingPresses]; // copy
    for (const idx of button) {
      newRemainingPresses[idx]--;
    }
    return newRemainingPresses;
  }

  /**
   * @param {number[]} remainingPresses How many times each remaining light needs to be hit
   * @param {number[][]} buttons The buttons
   * @param {number} depth How many buttons we've pressed so far during the search
   */
  function recursivelySearch(remainingPresses, buttons, depth) {
    // if there are any negative values, we've pressed too many buttons
    const invalid = remainingPresses.some((v) => v < 0);
    if (invalid) return;

    // If there are no non-zero values we've found a solution
    const solved = !remainingPresses.some((v) => v != 0);
    if (solved) {
      minPresses = depth; // we would have aborted earier if this weren't the minimum
    }

    // Abort if we already exceeded the best known minimum
    const remainingStepsUntilSolution = remainingPresses.reduce(
      (a, b) => Math.max(a, b),
      0
    );
    if (remainingStepsUntilSolution + depth > minPresses) return;

    // Preferentially search buttons that are the only option to decrease
    // large values while leaving small values as they are
    for (let i = 0; i < remainingPresses.length; i++) {
      for (let j = 0; j < remainingPresses.length; j++) {
        if (remainingPresses[i] > remainingPresses[j]) {
          const buttonsThatCanDecreaseIandNotJ = buttons.filter(
            (b) => b.includes(i) && !b.includes(j)
          );
          if (buttonsThatCanDecreaseIandNotJ.length === 0) return; // we're cooked

          // If there is only one, we're forced to press it
          if (buttonsThatCanDecreaseIandNotJ.length === 1) {
            const newRemainingPresses = remainingPressesAfterButtonPress(
              remainingPresses,
              buttonsThatCanDecreaseIandNotJ[0]
            );
            recursivelySearch(newRemainingPresses, buttons, depth + 1);
            return;
          }
          // TODO: more heuristicss
        }
      }
    }

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const newRemainingPresses = remainingPressesAfterButtonPress(
        remainingPresses,
        button
      );

      recursivelySearch(newRemainingPresses, buttons.slice(i), depth + 1);
    }
  }

  recursivelySearch(circuit.joltage, circuit.buttons, 0);

  if (minPresses == Number.MAX_SAFE_INTEGER)
    throw new Error("No solution found");

  console.log("Found optimal solution for", circuit.joltage);

  return minPresses;
}

/**
 *
 * @param {number} n
 * @returns {Generator<number[]>}
 */
function* binaryArrays(n) {
  let num = 0;

  while (num < 2 ** n) {
    const state = [];
    for (let i = 0; i < n; i++) {
      const mask = 1 << i;
      state[i] = (num & mask) == 0 ? 0 : 1;
    }
    num++;
    yield state;
  }
}

let elements = [];
const circuits = lines.map(parseLine);
const solution1 = sum(circuits.map(minimumNumberOfPressesToTurnOn));
console.log(solution1);

const solution2 = sum(circuits.map(minimumNumberOfPressesToMatchJoltage));
console.log(solution2);
