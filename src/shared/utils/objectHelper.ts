/**
 * useful for filtering fields from an object
 */
export function limitFields<T extends object>(original: any, keys: string[]): T {
  return Object.keys(original)
    .filter((key) => !keys.includes(key as any))
    .reduce((obj: any, key) => {
      obj[key] = (original as any)[key];
      return obj;
    }, {});
}
/**
 * useful for get key of an object based on value
 */
export function getKeyByValue<T>(obj: Record<string, T>, value: T): string | undefined {
  return Object.keys(obj).find((key) => obj[key as keyof typeof obj] === value);
}
