import fs from "node:fs/promises";
import { splitAtDelimiter, NUMBER_COMPARATOR, distinctPairs } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline

let elements = [];
let solution = 0;
for (const line of lines) {
  
}

console.log(solution);
