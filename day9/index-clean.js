import fs from "node:fs/promises";
import { distinctPairs } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline

const NOT_DETERMINED = 0;
const OUTSIDE = 1;
const WALL = 2;

/**
 * @typedef {object} Corner
 * @property {number} x
 * @property {number} y
 * @property {number} xIndex
 * @property {number} yIndex
 */

/** @type {Corner[]} */
let corners = lines
  .map((line) => line.split(",").map(Number))
  .map(([x, y]) => ({
    x,
    y,
    xIndex: -1,
    yIndex: -1,
  }));

// sort the corners by x and y coordinate
const cornersX = corners.toSorted((a, b) => a.x - b.x);
const cornersY = corners.toSorted((a, b) => a.y - b.y);

// Populate x index
let previousX = -1;
let xIndex = -1;
for (const corner of cornersX) {
  if (corner.x != previousX) {
    previousX = corner.x;
    xIndex += 2;
  }
  corner.xIndex = xIndex;
}

// populate y index
let previousY = -1;
let yIndex = -1;
for (const corner of cornersY) {
  if (corner.y != previousY) {
    previousY = corner.y;
    yIndex += 2;
  }
  corner.yIndex = yIndex;
}

// Initialize the Minigrid
// add some margin so that the flood-fill will wrap around the shape
/** @type {number[][]} */
const miniGrid = [];
for (let y = 0; y < yIndex + 2; y++) {
  miniGrid.push(new Array(xIndex + 2).fill(NOT_DETERMINED));
}

// Outline the shape on the minigrid
/** @type {Corner|null} */
let previous = null;
for (const corner of corners) {
  if (previous != null) connect(corner, previous);
  previous = corner;
}

if (!previous) throw Error();
connect(previous, corners[0]);

/**
 * Connects two points with a line
 * @param {Corner} corner
 * @param {Corner} previous
 */
function connect(corner, previous) {
  // Vertical Line
  if (corner.xIndex == previous.xIndex) {
    const minY = Math.min(corner.yIndex, previous.yIndex);
    const maxY = Math.max(corner.yIndex, previous.yIndex);

    miniGrid[minY][corner.xIndex] = WALL;
    miniGrid[maxY][corner.xIndex] = WALL;

    for (let y = minY + 1; y <= maxY - 1; y++) {
      miniGrid[y][corner.xIndex] = WALL;
    }
  } else if (corner.yIndex == previous.yIndex) {
    const minX = Math.min(corner.xIndex, previous.xIndex);
    const maxX = Math.max(corner.xIndex, previous.xIndex);

    miniGrid[corner.yIndex][minX + 1] = WALL;
    miniGrid[corner.yIndex][maxX - 1] = WALL;

    for (let x = minX + 1; x <= maxX - 1; x++) {
      miniGrid[corner.yIndex][x] = WALL;
    }
  } else {
    throw new Error("Diagonal Lines are not supported");
  }
}

// Flood Fill all points outside of the shape
// 0,0 is guaranteed to be outside the shape, since the first point can at most be at 1,1
const visible = [[0, 0]];
const visited = new Set();

while (visible.length > 0) {
  const point = visible.pop();
  if (!point) continue;
  const [y, x] = point;
  const key = `${y},${x}`;

  if (visited.has(key)) continue;
  if (y < 0 || y >= miniGrid.length || x < 0 || x >= miniGrid[0].length)
    continue;
  if (miniGrid[y][x] !== NOT_DETERMINED) continue;

  visited.add(key);
  miniGrid[y][x] = OUTSIDE;

  visible.push([y + 1, x]);
  visible.push([y - 1, x]);
  visible.push([y, x + 1]);
  visible.push([y, x - 1]);
}

let max = 0;
for (const [a, b] of distinctPairs(cornersX)) {
  // Calculate the area first & only check if it's inside if it's bigger
  // This allows skipping many small rectangles
  const area = (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
  if (area > max) {

    // Check that the proposed rectangle is actually inside the shape
    const xIndexMin = Math.min(a.xIndex, b.xIndex);
    const xIndexMax = Math.max(a.xIndex, b.xIndex);
    const yIndexMin = Math.min(a.yIndex, b.yIndex);
    const yIndexMax = Math.max(a.yIndex, b.yIndex);

    let valid = true;
    check: for (let y = yIndexMin; y <= yIndexMax; y++) {
      for (let x = xIndexMin; x <= xIndexMax; x++) {
        const square = miniGrid[y][x];
        if (square == OUTSIDE) {
          valid = false;
          break check;
        }
      }
    }

    if (valid) max = area;
  }
}

console.log(max);
