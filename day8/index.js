import fs from "node:fs/promises";
import { splitAtDelimiter, NUMBER_COMPARATOR } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline
const boxes = lines.map((line) => line.split(",").map(Number));

const edges = new Map(); // maps all the edges to their cost
for (let i = 0; i < boxes.length - 1; i++) {
  for (let j = i + 1; j < boxes.length; j++) {
    const box = boxes[i];
    const boxB = boxes[j];
    const edge = `${i}-${j}`;

    const diff = [box[0] - boxB[0], box[1] - boxB[1], box[2] - boxB[2]];
    const distance = Math.sqrt(diff[0] ** 2 + diff[1] ** 2 + diff[2] ** 2);

    edges.set(edge, distance);
  }
}
/*
// 1. Find minimal spanning tree
// 2. Find the longest edge in the spanning tree
let visited = new Set(); // the nodes in the spanning tree
let spanningTreeEdges = new Set(); // the edges in the spanning tree
visited.add(0);

while (visited.size < boxes.length) {
    // find the next box to add
    let closestBox = null;
    let clostestBoxDistance = null;

    for (const node of visited) {
        for (let i = 0; i < boxes.length; i++) {
            const distance =
        }
    }
}
    */

const NUM_CONNECTIONS = 1000;
const visited = new Set();

let lastVisited = [];

let circuits = new Set();
while (visited.size < boxes.length) {
    console.log(visited.size);
  let shortestConnection = [];
  let shortestConnectionDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (visited.has(i) && visited.has(j)) continue; // only consider external edges

      const connection = `${i}-${j}`;
      const distance = edges.get(connection);

      if (distance < shortestConnectionDistance) {
        shortestConnection = [i, j];
        shortestConnectionDistance = distance;
      }
    }
  }
    
    
    visited.add(shortestConnection[0]);
    visited.add(shortestConnection[1]);

    lastVisited = shortestConnection;
}

const last = lastVisited.map(i => boxes[i]);
const solution = last[0][0] *last[1][0]

console.log(lastVisited.map(i => boxes[i]));
console.log(solution);
