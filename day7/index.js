import fs from "node:fs/promises";
import { splitAtDelimiter } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline

let solution = 0;
let beamIndexes = new Map();
for (let i = 0; i < lines.length; i++) {
  if (i == 0) {
    const startIndex = lines[0].indexOf("S");
    beamIndexes = new Map();
    beamIndexes.set(startIndex, 1);
  } else {
    // Find all the places with a ^
    const splitterIndexes = findAllIndexes(lines[i], "^");
    console.log(lines[i], splitterIndexes);

    // loop over all indexes that currently have a beam
    // if they hit a splitter, split
    const newBeamIndexes = new Map();
    for (const [beam, multiplicity] of beamIndexes.entries()) {
      // didnt hit a splitter -> continue on
      if (!splitterIndexes.has(beam)) {
        const existingMultipliciity = newBeamIndexes.get(beam ) ?? 0;
        newBeamIndexes.set(beam, existingMultipliciity + multiplicity);
        continue;
      }

      // hit a splitter
      if (beam >= 1) {
        // if there already is a beam here, add to it's mutiplicity
        const existingMultipliciity = newBeamIndexes.get(beam - 1) ?? 0;
        newBeamIndexes.set(beam - 1, existingMultipliciity + multiplicity);
      }

      if (beam < lines[0].length - 1) {
        const existingMultipliciity = newBeamIndexes.get(beam + 1) ?? 0;
        newBeamIndexes.set(beam + 1, existingMultipliciity + multiplicity);
      }
      solution++;
    }
    beamIndexes = newBeamIndexes;
  }
}

/**
 *
 * @param {string} string
 */
function findAllIndexes(string, pattern) {
  const indexes = new Set();
  let i = 0;
  while (true) {
    const nextIndex = string.indexOf(pattern, i);
    if (nextIndex == -1) break;

    indexes.add(nextIndex);
    i = nextIndex + 1;
  }

  return indexes;
}

let solution2 = 0;
for (const [idx, multiplicity] of beamIndexes) {
  solution2 += multiplicity;
}
console.log(beamIndexes, solution2);

// console.log(solution);
