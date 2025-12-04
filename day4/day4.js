import fs from "node:fs/promises";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.split("\n");

let grid = [];
for (const line of lines) {
  if (line.trim().length == 0) continue; // skip empty lines
  grid.push(line.split(""));
}

let acc = 0;

while (true) {
  let newGrid = structuredClone(grid);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      newGrid[y][x] = visit(y, x);
    }
  }

  if (JSON.stringify(grid) == JSON.stringify(newGrid)) {
    break;
  }

  grid = newGrid;
}

console.log(acc);

function visit(y, x) {
  if (grid[y][x] != "@") return grid[y][x];
  let count = 0;

  if (isSet(y - 1, x - 1)) count++;
  if (isSet(y - 1, x)) count++;
  if (isSet(y - 1, x + 1)) count++;

  if (isSet(y, x - 1)) count++;
  if (isSet(y, x + 1)) count++;

  if (isSet(y + 1, x - 1)) count++;
  if (isSet(y + 1, x)) count++;
  if (isSet(y + 1, x + 1)) count++;

  if (count < 4) {
    acc++;
    return "x";
  }

  return "@";
}

function isSet(y, x) {
  if (y < 0 || y >= grid.length) return false;
  if (x < 0 || x >= grid[0].length) return false;
  return grid[y][x] == "@";
}

console.log(acc);
