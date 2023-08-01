/**
 * Object functions
 */

export function hasProperty(obj: any, prop: string) {
  return (
    typeof obj === "object" &&
    (!!(obj && obj[prop]) ||
      (obj instanceof Object &&
        Object.prototype.hasOwnProperty.call(obj, prop)))
  );
}

export function hasMethod(obj: any, prop: string): boolean {
  return hasProperty(obj, prop) && typeof obj[prop] === "function";
}

export function isEmpty(obj: any): boolean {
  return typeof obj !== "object" || !Object.keys(obj).length;
}

// get the specified property or nested property of an object
export function getObjPath(
  path?: string,
  obj?: any,
  fallback: any = "",
): any | Record<string, any> | undefined {
  if (typeof obj !== "object" || typeof path !== "string") {
    return fallback;
  }

  return path.split(".").reduce((res, key) => res[key] || fallback, obj);
}
