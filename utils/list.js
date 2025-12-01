/**
 * Splits an array into sub-arrays at each occurrence of the specified delimiter.
 * @template T
 * @param {T[]} arr
 * @param {T} delimiter
 * @returns {T[][]} An array of sub-arrays split at the delimiter.
 */
export function splitAtDelimiter(arr, delimiter) {
  const result = [];
  let currentSubArray = [];

  for (const item of arr) {
    if (item === delimiter) {
      result.push(currentSubArray);
      currentSubArray = [];
    } else {
      currentSubArray.push(item);
    }
  }
    
  result.push(currentSubArray);
  return result;
}

/**
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */
export const NUMBER_COMPARATOR = (a, b) => a - b;

/**
 * Calculates the sum of all elements in an array.
 * @param {number[]} arr 
 * @returns {number} The sum of the elements.
 */
export function sum(arr) { 
    return arr.reduce((acc, val) => acc + val, 0);
}

/**
 * Returns the average of all elements in an array.
 * @param {number[]} arr 
 * @returns 
 */
export function average(arr) {
    if (arr.length === 0) return 0;
    return sum(arr) / arr.length;
}

