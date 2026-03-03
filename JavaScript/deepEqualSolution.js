function deepEqual(a, b, visited = new WeakMap()) {
  // 1. Same reference equality (fast path)
  if (a === b) {
    // Handle special number cases: NaN and ±0
    return a !== 0 || b !== 0 || 1 / a === 1 / b; // +0 !== -0
  }

  // 2. Handle NaN (NaN !== NaN, but we want deepEqual(NaN, NaN) === true)
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  // 3. Type check
  const typeA = typeof a;
  const typeB = typeof b;
  
  if (typeA !== typeB) {
    return false;
  }

  // 4. Handle null (typeof null === 'object')
  if (a === null || b === null) {
    return a === b;
  }

  // 5. Handle primitives (excluding objects and functions)
  if (typeA !== 'object' && typeA !== 'function') {
    return a === b;
  }

  // 6. Check for circular reference
  if (visited.has(a) && visited.get(a) === b) {
    return true;
  }
  
  // Mark as visited
  visited.set(a, b);

  // 7. Handle Array comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], visited)) {
        return false;
      }
    }
    return true;
  }

  // 8. Handle Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 9. Handle RegExp comparison
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  // 10. Handle Map comparison
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    }
    
    for (const [key, value] of a) {
      if (!b.has(key) || !deepEqual(value, b.get(key), visited)) {
        return false;
      }
    }
    return true;
  }

  // 11. Handle Set comparison
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) {
      return false;
    }
    
    const arrayA = Array.from(a);
    const arrayB = Array.from(b);
    
    // Sort for comparison (order doesn't matter in Set)
    arrayA.sort();
    arrayB.sort();
    
    for (let i = 0; i < arrayA.length; i++) {
      if (!deepEqual(arrayA[i], arrayB[i], visited)) {
        return false;
      }
    }
    return true;
  }

  // 12. Handle ArrayBuffer and TypedArrays
  if (a.buffer instanceof ArrayBuffer && b.buffer instanceof ArrayBuffer) {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    
    const viewA = new Uint8Array(a.buffer);
    const viewB = new Uint8Array(b.buffer);
    
    for (let i = 0; i < viewA.length; i++) {
      if (viewA[i] !== viewB[i]) {
        return false;
      }
    }
    return true;
  }

  // 13. Handle Error objects
  if (a instanceof Error && b instanceof Error) {
    return a.message === b.message && a.name === b.name;
  }

  // 14. Handle functions (compare by reference)
  if (typeA === 'function') {
    return a === b;
  }

  // 15. Handle generic objects (including class instances)
  
  // Get all property keys (including symbols and non-enumerable)
  const keysA = getAllKeys(a);
  const keysB = getAllKeys(b);
  
  // Check if they have the same number of properties
  if (keysA.length !== keysB.length) {
    return false;
  }
  
  // Compare each property
  for (const key of keysA) {
    // Check if key exists in b
    if (!hasOwnProperty(b, key)) {
      return false;
    }
    
    // Compare property values deeply
    if (!deepEqual(a[key], b[key], visited)) {
      return false;
    }
    
    // Bonus: Compare property descriptors
    const descriptorA = Object.getOwnPropertyDescriptor(a, key);
    const descriptorB = Object.getOwnPropertyDescriptor(b, key);
    
    if (descriptorA && descriptorB) {
      // Check if both are getters/setters or both are data descriptors
      if (!!descriptorA.get !== !!descriptorB.get || 
          !!descriptorA.set !== !!descriptorB.set) {
        return false;
      }
      
      // For data descriptors, compare writable, enumerable, configurable
      if (!descriptorA.get && !descriptorA.set) {
        if (descriptorA.writable !== descriptorB.writable ||
            descriptorA.enumerable !== descriptorB.enumerable ||
            descriptorA.configurable !== descriptorB.configurable) {
          return false;
        }
      }
    } else if (descriptorA || descriptorB) {
      // One has descriptor, other doesn't
      return false;
    }
  }
  
  // Check prototype chain
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }
  
  return true;
}

// Helper function to get all keys (including symbols and non-enumerable)
function getAllKeys(obj) {
  const keys = [];
  
  // Get enumerable string keys
  for (const key in obj) {
    keys.push(key);
  }
  
  // Get symbol keys (including non-enumerable)
  const symbols = Object.getOwnPropertySymbols(obj);
  keys.push(...symbols);
  
  // Get non-enumerable string keys (optional, more thorough)
  const allProperties = Object.getOwnPropertyNames(obj);
  for (const prop of allProperties) {
    if (!keys.includes(prop)) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      if (descriptor && descriptor.enumerable === false) {
        keys.push(prop);
      }
    }
  }
  
  return keys;
}

// Helper function to check if object has own property (including non-enumerable)
function hasOwnProperty(obj, key) {
  // Check string/symbol key
  if (typeof key === 'string' || typeof key === 'symbol') {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return false;
}

// Bonus: Handle Promise comparison (compare by reference)
function isPromise(obj) {
  return obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
}

// Update deepEqual to handle Promises
const originalDeepEqual = deepEqual;
deepEqual = function(a, b, visited = new WeakMap()) {
  // Handle Promises (compare by reference)
  if (isPromise(a) && isPromise(b)) {
    return a === b;
  }
  return originalDeepEqual(a, b, visited);
};

module.exports = deepEqual;