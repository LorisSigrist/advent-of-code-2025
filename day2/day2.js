import fs from "node:fs/promises";

const input = await fs.readFile("input.my.txt", { encoding: "utf-8" });

let sum = 0;
const ranges = input.split(",");
for (const range of ranges) {
  const [start, end] = range.split("-").map(Number);
  if (Number.isNaN(start) || Number.isNaN(end)) continue;

  for (let i = start; i <= end; i++) {
    if (isInvalid(i)) sum += i;
  }
}
console.log(sum);

function isInvalid(i) {
  const num = `${i}`; // stringify without leading 0s

  for (let prefixLength = 1; prefixLength <= num.length / 2; prefixLength++) {
    if (num.length % prefixLength != 0) continue; // skip prefix lengths that dont fit

    const prefix = num.slice(0, prefixLength);
    let repeated = "";
    const repeats = num.length / prefixLength;
    for (let i = 0; i < repeats; i++) {
      repeated += prefix;
    }

    if (repeated == num) return true;
  }

  return false;
}
