import slugify from "slugify";
import { kebabCase } from "lodash";

export { kebabCase, startCase, round } from "lodash";

export function toSlug(input: string) {
  return slugify(kebabCase(input));
}

export function toArray(param: Record<string, unknown>) {
  if (typeof param !== "object") return;
  return Object.keys(param).map((key) => param[key]);
}

// from https://fettblog.eu/typescript-hasownproperty/
export function hasOwnProperty<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return typeof obj === "object" && Object.prototype.hasOwnProperty.call(obj, prop);
}

export function hasOwnMethod<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return hasOwnProperty(obj, prop) && typeof obj[prop] === "function";
}
