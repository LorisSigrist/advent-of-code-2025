import fs from "node:fs/promises";
import { sum } from "../utils/list.js";

const input = await fs.readFile("input.txt", { encoding: "utf-8" });
const lines = input.trim().split("\n"); // trim off final newline

/**
 * @typedef {object} Node
 * @property {string} name
 * @property {Set<string>} tos Nodes it connects to
 */

/**
 * @type {Map<string, Node>}
 */
const graph = new Map();

/**
 * @param {string} name
 * @param {Set<string>} tos
 * @param {Map<string, Node>} graph
 */
function insert(name, tos, graph) {
  const existing = graph.get(name);

  // if the node does not exist yet, create it
  if (!existing) {
    graph.set(name, {
      name,
      tos,
    });
  } else {
    // add the tos to the existing node
    for (const newTo of tos) {
      existing.tos.add(newTo);
    }
  }

  // insert all children too, just to make sure
  for (const to of tos) {
    insert(to, new Set(), graph);
  }
}

for (const line of lines) {
  const [from, to] = line.split(": ");
  const tos = new Set(to.split(" "));
  insert(from, tos, graph);
}

let validPaths = 0;

/**
 * @param {string} node The current node
 * @param {string} target
 * @param {Map<string, Node>} graph
 * @param {Set<string>} visited
 *
 * @returns {number}
 */
function dfs(node, target, graph, visited, path, mustIncludes) {
  path = [...path, node];
    if (node == target) {
       
    let includesAll = true;
    for (const include of mustIncludes) {
      if (!path.includes(include)) includesAll = false;
    }
        if (includesAll) {
            validPaths++;
            console.log(validPaths);
        }
        
    return includesAll ? 1 : 0;
  }

  visited.add(node);

  const Node = graph.get(node);
  if (!Node) throw new Error("Unknown node " + node);

  let total = 0;
  for (const to of Node.tos) {
    if (!visited.has(to)) {
      total += dfs(to, target, graph, visited, path, mustIncludes);
    }
  }
  visited.delete(node);
  return total;
}

const solution = dfs("svr", "out", graph, new Set(), [], ["fft", "dac"]);
console.log(solution);
