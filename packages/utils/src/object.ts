/**
 * Object functions
 */

export function hasProperty(obj: any, prop: string) {
  return (
    !!(obj && obj[prop]) ||
    (obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, prop))
  );
}

export function hasMethod(obj: any, prop: string) {
  return hasProperty(obj, prop) && typeof obj[prop] === "function";
}
