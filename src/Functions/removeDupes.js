export function getUniqueObjectsById(arr) {
    const map = new Map();
    for (const obj of arr) {
      if (!map.has(obj.id)) {
        map.set(obj.id, obj); // store the full object
      }
    }
    return Array.from(map.values());
  }