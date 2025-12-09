import fs from "node:fs/promises";
import { splitAtDelimiter } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline

const lastLine = lines[lines.length - 1];
const operationIndexes = [];
for (let i = 0; i < lastLine.length; i++) {
  const char = lastLine[i];
  if (char == "*" || char == "+") {
    operationIndexes.push(i);
  }
}

function splitIndexAtIndexes(str, indexes) {
  const split = [];

  let currentString = "";

  for (let i = 0; i < str.length; i++) {
    if (indexes.includes(i) && i != 0) {
      split.push(currentString);
      currentString = "";
    }

    if (!indexes.includes(i + 1)) {
      const char = str[i];
      currentString += char;
    }
  }

  split.push(currentString);
  return split;
}

console.log(operationIndexes);

const problems = [];
for (let i = 0; i < lines.length - 1; i++) {
  const digits = splitIndexAtIndexes(lines[i], operationIndexes);

  for (let j = 0; j < operationIndexes.length; j++) {
    const problemDigits = problems[j] ?? [];
    problemDigits.push(digits[j]);
    problems[j] = problemDigits;
  }
}

console.log(problems);


// map problem strings onto solutions
const parsedProblems = [];
for (const problem of problems) {
    let numbers = [];
    for (let i = 0; i < problem[0].length; i++) {
        let num = "";
        for (const entry of problem) {
            console.log(entry);
            if (!entry[i]) continue;
            num += entry[i];
        }
        console.log(problem, i, num);
        numbers.push(Number.parseInt(num.trim()))
    }
    parsedProblems.push(numbers);
}

console.log(parsedProblems);

const operations = operationIndexes.map(i => lastLine[i]);
console.log(operations);

let solution = 0;
for (let j = 0; j < operationIndexes.length; j++) {
  const nums = parsedProblems[j];

  
    if (operations[j] == "*") {
        const product = nums.reduce((acc, prev) => acc * prev, 1);
        solution += product;
    } else if (operations[j] == "+") {
        const sum = nums.reduce((acc, prev) => acc + prev, 0);
         solution += sum;
    }
    
}

console.log(operations, problems);
console.log(solution);
