export function hasIntersection(arr1: number[], arr2: number[]): boolean {
  // Determine which arrays is smaller to minimize iterations
  const [smallerArray, largerArray] = arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];

  // Convert the larger array to set
  const largerSet = new Set(largerArray);

  // Check for intersection
  for (const num of smallerArray) {
    if (largerSet.has(num)) {
      return true; // Found intersection
    }
  }

  return false; // No intersection found
}

export function getIntersections(arr1: number[], arr2: number[]): number[] {
  // Determine which arrays is smaller to minimize iterations
  const [smallerArray, largerArray] = arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];

  // Convert the larger array to set
  const largerSet = new Set(largerArray);

  const intersections: number[] = [];

  // Check for intersection
  for (const num of smallerArray) {
    if (largerSet.has(num)) {
      intersections.push(num); // Found intersection
    }
  }

  return intersections; // No intersection found
}

export function separateIds(ids: string[]): { uuids: string[]; nonUuids: string[]; allIds: string[] } {
  return {
    // only UUIDs
    uuids: ids.filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)),
    // all non UUIDs
    nonUuids: ids.filter((id) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)),
    // all ids, ensure immutability
    allIds: [...ids],
  };
}
