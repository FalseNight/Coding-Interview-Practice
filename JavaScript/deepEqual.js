/**
 * deepEqual - Deep comparison of two JavaScript values
 * 
 * Implement a function that returns true if two values are deeply equal.
 * 
 * Requirements:
 * 1. Compare primitives (numbers, strings, booleans, null, undefined, symbols)
 * 2. Compare objects by value (including nested objects and arrays)
 * 3. Handle special number cases: NaN, +0, -0
 * 4. Handle circular references (avoid infinite recursion)
 * 5. Support built-in objects: Date, RegExp, Map, Set, ArrayBuffer, etc.
 * 6. Functions compared by reference
 * 7. Compare object property descriptors
 * 
 * @param {any} a - First value to compare
 * @param {any} b - Second value to compare
 * @param {WeakMap} visited - Track visited objects for circular reference detection
 * @returns {boolean} - True if deeply equal
 */

function deepEqual(a, b, visited = new WeakMap()) {
  // TODO: Implement deep equality check

  // Base cases to handle:
  // 1. Same reference equality (short-circuit)
  // 2. Primitive type comparison
  // 3. Special number cases (NaN, ±0)
  // 4. Type mismatch
  // 5. null/undefined
  // 6. Functions
  // 7. Built-in objects (Date, RegExp, etc.)
  // 8. Arrays
  // 9. Objects (including circular references)
  
  throw new Error('Not implemented');
}

// Export for testing
module.exports = deepEqual;

// Example test cases (for reference):

// Primitives
deepEqual(42, 42); // true
deepEqual('hello', 'hello'); // true
deepEqual(true, true); // true
deepEqual(null, null); // true
deepEqual(undefined, undefined); // true

// Special number cases
deepEqual(NaN, NaN); // true (special case!)
deepEqual(+0, -0); // true

// Objects
deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
deepEqual([1, 2, 3], [1, 2, 3]); // true

// Nested structures
deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }); // true

// Circular references
const obj1 = { a: 1 };
obj1.self = obj1;
const obj2 = { a: 1 };
obj2.self = obj2;
deepEqual(obj1, obj2); // true

// Built-in objects
deepEqual(new Date('2023-01-01'), new Date('2023-01-01')); // true
deepEqual(/test/gi, /test/gi); // true
deepEqual(new Map([['a', 1]]), new Map([['a', 1]])); // true
deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3])); // true

// Functions (by reference)
const fn1 = () => {};
const fn2 = () => {};
deepEqual(fn1, fn1); // true
deepEqual(fn1, fn2); // false

// False cases
deepEqual({ a: 1 }, { a: 1, b: 2 }); // false (different number of properties)
deepEqual([1, 2], [2, 1]); // false (order matters for arrays)
deepEqual({ a: 1 }, { a: '1' }); // false (different types)
