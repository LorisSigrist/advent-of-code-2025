import fs from "node:fs/promises";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });

const rotations = input.split("\n");
let dial = 50;
let count = 0;

for (const rotation of rotations) {
  const dir = rotation.charAt(0);
  const amount = Number.parseInt(rotation.slice(1));

  // skip empty lines
  if (Number.isNaN(amount)) continue;

  // fuck it, brute force
  for (let i = 0; i < amount; i++) {
    dial += dir == "L" ? -1 : 1;
    if (dial < 0) dial += 100;
    if (dial > 99) dial -= 100;
    if (dial == 0) count++;
  }
}

console.log(count);
