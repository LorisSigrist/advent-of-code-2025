import fs from "node:fs/promises"

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.split("\n");

for (const line of lines) { 
    
}