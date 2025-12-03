import fs from "node:fs/promises";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.split("\n");

let sum = 0;
for (const line of lines) {
  if (line.trim().length == 0) continue; // skip empty lines
  const voltages = line.split("").map(Number);

  sum += maxAfter(voltages, 12, 0);
}

console.log(sum);

/**
 * Finds the largest number that can be formed by selectively
 * chosing n digits from the digits array, without switching the order
 *
 * @param {number[]} digits THe array of digits to pick n digits from
 * @param {number} n The number of digits to pick
 * @param {number} k After which index to start picking numbers (inclusive)
 * @returns {number}
 */
function maxAfter(digits, n, k) {
  if (n == 0) return 0;
  // find the largest value, starting at index k
  let max = digits[k];
  let maxIdx = k;

  for (let i = k; i <= digits.length - n; i++) {
    if (digits[i] > max) {
      max = digits[i];
      maxIdx = i;
    }
  }

  return max * 10 ** (n - 1) + maxAfter(digits, n - 1, maxIdx + 1);
}
