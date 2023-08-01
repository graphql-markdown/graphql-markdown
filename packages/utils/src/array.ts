/**
 * Array functions
 */

export function toArray(param: any): any[] | undefined {
  if (typeof param !== "object" || param === null) {
    return undefined;
  }
  return (Object.keys(param) as Array<string>).map(
    (key: string): any => (<Record<string, any>>param)[key],
  );
}

export function convertArrayToObject<T>(typeArray: T[]): Record<string, T> {
  return typeArray.reduce(
    function (r, o: any) {
      if (o && o.name) r[o.name] = o;
      return r;
    },
    {} as Record<string, T>,
  );
}
