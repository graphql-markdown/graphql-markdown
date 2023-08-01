/**
 * Array functions
 */

export function toArray(param: unknown): unknown[] | undefined {
  if (typeof param !== "object" || param === null) {
    return undefined;
  }
  return (Object.keys(param) as Array<string>).map(
    (key: string): unknown => (<Record<string, unknown>>param)[key],
  );
}

export function convertArrayToObject<T>(typeArray: T[]): Record<string, T> {
  return typeArray.reduce(
    function (r, o: T) {
      if (
        typeof o === "object" &&
        o !== null &&
        "name" in o &&
        o.name &&
        typeof o.name === "string"
      ) {
        r[o.name] = o;
      }
      return r;
    },
    {} as Record<string, T>,
  );
}
