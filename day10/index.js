import fs from "node:fs/promises";
import {
  splitAtDelimiter,
  NUMBER_COMPARATOR,
  distinctPairs,
  sum,
} from "../utils/list.js";

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
 */
function minimumNumberOfPressesToMatchJoltage(circuit) {
  let minAssignment = Number.POSITIVE_INFINITY;

  // Fuck it, brute force
  const options = binaryArrays(circuit.buttons.length);

  /**
   * @param {number[]} option
   * @returns {number[]} joltages
   */
  function tryAssignemt(option) {
    const state = new Array(circuit.joltage.length).fill(0);
    for (let i = 0; i < option.length; i++) {
      const button = circuit.buttons[i];

      for (const idx of button) {
        state[idx] = state[idx] + option[i];
      }
    }
    return state;
  }

  function maxTimesThatButtonCanBePressed(i) {
    const option = new Array(circuit.buttons.length).fill(0);

    while (true) {
      const state = tryAssignemt(option);

      for (let j = 0; j < state.length; j++) {
        if (circuit.joltage[j] < state[j]) {
          return option[i] - 1;
        }
      }
      option[i]++;
    }
  }

  // Find the max times you can press each button individually before you're too big
  const buttonLimits = [];
  for (let i = 0; i < circuit.buttons.length; i++) {
    buttonLimits[i] = maxTimesThatButtonCanBePressed(i);
  }
    
    const numCombinations = buttonLimits.reduce((a, b) => a * b, 1);
    return numCombinations;

  for (const option of options) {
    const state = tryAssignemt(option);

    // loop over the state to see if it matches the lights
    let matches = true;
    for (let i = 0; i < circuit.joltage.length; i++) {
      if (state[i] != circuit.joltage[i]) {
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
const solution2 = sum(circuits.map(minimumNumberOfPressesToMatchJoltage));
console.log(solution1);
console.log(solution2);
