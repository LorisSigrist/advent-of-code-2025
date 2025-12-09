import fs from "node:fs/promises";
import { splitAtDelimiter, NUMBER_COMPARATOR } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline

/**
 * @typedef {object} Corner
 * @property {number} x
 * @property {number} y
 * @property {number} xIndex
 * @property {number} yIndex
 */

/**
 * @type {Corner[]}
 */
let corners = [];
for (const line of lines) {
  const corner = line.split(",").map(Number);
  corners.push({
    x: corner[0],
    y: corner[1],
    xIndex: -1,
    yIndex: -1,
  });
}

// sort the corners by x-coordinate
const cornersX = corners.toSorted((a, b) => a.x - b.x);
let previousX = -1;
let xIndex = -1;
for (let i = 0; i < cornersX.length; i++) {
  const corner = cornersX[i];
  if (corner.x == previousX) {
    corner.xIndex = xIndex;
  } else {
    xIndex += 2;
    previousX = corner.x;
    corner.xIndex = xIndex;
  }
}

const cornersY = corners.toSorted((a, b) => a.y - b.y);

let previousY = -1;
let yIndex = -1;
for (let i = 0; i < cornersY.length; i++) {
  const corner = cornersY[i];
  if (corner.y == previousY) {
    corner.yIndex = yIndex;
  } else {
    yIndex += 2;
    previousY = corner.y;
    corner.yIndex = yIndex;
  }
}

const dimensions = [xIndex + 1, yIndex + 1];

/**
 * @type {string[][]}
 */
const miniGrid = [];
for (let y = 0; y < dimensions[1]; y++) {
  miniGrid.push(new Array(dimensions[0]).fill("."));
}

// fill grid

/**
 * @type {Corner|null}
 */
let previous = null;
for (const corner of corners) {
  if (previous == null) {
    previous = corner;
    continue;
  }

  connect(corner, previous);

  previous = corner;
}

if (!previous) throw Error();
connect(previous, corners[0]);

/**
 * @param {Corner} corner
 * @param {Corner} previous
 */
function connect(corner, previous) {
  if (corner.xIndex == previous.xIndex) {
    const minY = Math.min(corner.yIndex, previous.yIndex);
    const maxY = Math.max(corner.yIndex, previous.yIndex);

    miniGrid[minY][corner.xIndex] = "O";
    miniGrid[maxY][corner.xIndex] = "O";

    for (let y = minY + 1; y <= maxY - 1; y++) {
      miniGrid[y][corner.xIndex] = "#";
    }
  }

  if (corner.yIndex == previous.yIndex) {
    const minX = Math.min(corner.xIndex, previous.xIndex);
    const maxX = Math.max(corner.xIndex, previous.xIndex);

    miniGrid[corner.yIndex][minX + 1] = "O";
    miniGrid[corner.yIndex][maxX - 1] = "O";

    for (let x = minX + 1; x <= maxX - 1; x++) {
      miniGrid[corner.yIndex][x] = "#";
    }
  }
}

await fs.rm("minigrid-outlined.txt");
await fs.writeFile("minigrid-outlined.txt", stringifyMinigrid(miniGrid), {
  encoding: "utf-8",
});

/*
// FUCKASS Raycast implementation that didnt work
for (let y = 0; y < dimensions[1]; y++) {
  outer: for (let x = 0; x < dimensions[0]; x++) {
    if (miniGrid[y][x] != ".") continue;

      let numIntersections = 0;
    // raycast to the right. odd -> inside
    for (let ray = x + 1; ray < dimensions[0]; ray++) {
        if (miniGrid[y][ray] == "O") {
            break; // stop raycast
        }
        if (miniGrid[y][ray] == "#") {
            numIntersections++;
        }
    }

      // inside
    if (numIntersections % 2 == 1) {
      miniGrid[y][x] = "#";
    }
  }
}
  */

/** @type {[number,number][]} */
const visible = [[50, 200]];
const visited = new Set();

while (visible.length > 0) {
  const point = visible.pop();
  if (!point) continue;
  const [y, x] = point;
  const key = `${y},${x}`;

  if (visited.has(key)) continue;
  if (y < 0 || y >= miniGrid.length || x < 0 || x >= miniGrid[0].length)
    continue;
  if (miniGrid[y][x] !== ".") continue;

  visited.add(key);
  miniGrid[y][x] = "#";

  visible.push([y + 1, x]);
  visible.push([y - 1, x]);
  visible.push([y, x + 1]);
  visible.push([y, x - 1]);
}

await fs.rm("minigrid-filled.txt");
await fs.writeFile("minigrid-filled.txt", stringifyMinigrid(miniGrid), {
  encoding: "utf-8",
});

let max = 0;
for (let i = 0; i < corners.length - 1; i++) {
  for (let j = i + 1; j < corners.length; j++) {
    const a = corners[i];
    const b = corners[j];

    const area = (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
    if (area > max) {
      // only accept squares that are entirely within the shape

      const xIndexMin = Math.min(a.xIndex, b.xIndex);
      const xIndexMax = Math.max(a.xIndex, b.xIndex);
      const yIndexMin = Math.min(a.yIndex, b.yIndex);
      const yIndexMax = Math.max(a.yIndex, b.yIndex);

      let valid = true;
      check: for (let y = yIndexMin; y <= yIndexMax; y++) {
        for (let x = xIndexMin; x <= xIndexMax; x++) {
          const square = miniGrid[y][x];
          if (square == ".") {
            valid = false;
            break check;
          }
        }
      }

      if (valid) {
        max = area;
      }
    }
  }
}

console.log(max);

/**
 * @param {string[][]} minigrid
 * @returns
 */
function stringifyMinigrid(minigrid) {
  const str = minigrid.map((line) => line.join("")).join("\n");
  return str;
}
