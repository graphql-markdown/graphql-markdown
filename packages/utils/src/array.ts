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
    (result, entry: T) => {
      if (typeof entry === "object" && entry !== null) {
        const key =
          "name" in entry &&
          entry.name !== null &&
          typeof entry.name !== "undefined"
            ? entry.name.toString()
            : null;
        if (key === null) {
          return result;
        }
        result[key] = entry;
      }
      return result;
    },
    {} as Record<string, T>,
  );
}
