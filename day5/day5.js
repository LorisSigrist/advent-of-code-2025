import fs from "node:fs/promises";
import { splitAtDelimiter } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n");

const [rangesStr, idsStr] = splitAtDelimiter(lines, "");
let ranges = rangesStr.map(parseRange);
// const ids = idsStr.map(Number);

const insertedRanges = [];
// let solution = 0;

for (const range of ranges) {
  insert(range);
}

function insert(range) {
  if (range[1] < range[0]) return;

  for (const insertedRange of insertedRanges) {
    const o = overlap(range, insertedRange);
    if (!o) continue;

    // if there is an overlap, there can be one of four situations
    // - range = insertedRange -> done
    // - insertedRange fully contains range -> done
    // - range fully contains insertedRange -> reinsert tail &
    // - range starts & ends after the insertedRange -> reinsert tail
    // - range starts & ends before the insertedRange -> reinsert head

    if (insertedRange[0] <= range[0] && insertedRange[1] >= range[1]) return;

    if (range[0] >= insertedRange[0] && range[1] > insertedRange[1]) {
      insert([insertedRange[1] + 1, range[1]]);
      return;
    }

    if (range[0] < insertedRange[0] && range[1] <= insertedRange[1]) {
      insert([range[0], insertedRange[0] - 1]);
      return;
    }

    if (range[0] < insertedRange[0] && range[1] > insertedRange[1]) {
      insert([range[0], insertedRange[0] - 1]);
      insert([insertedRange[1] + 1, range[1]]);
      return;
    }
  }

  // no overlaps
  // solution += range[1] - range[0] + 1;
  insertedRanges.push(range);
}

const solution = insertedRanges.reduce(
  (acc, curr) => curr[1] - curr[0] + 1 + acc,
  0
);

console.log(solution);

function overlap(a, b) {
  const overlap = [Math.max(a[0], b[0]), Math.min(a[1], b[1])];
  if (overlap[0] > overlap[1]) return null;
  return overlap;
}

function parseRange(str) {
  return str.trim().split("-").map(Number);
}
