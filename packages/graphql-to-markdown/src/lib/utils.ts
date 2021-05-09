const slugify = require("slugify");
import { kebabCase } from "lodash";

export { kebabCase, startCase, round } from  "lodash";

export function toSlug(input: string) {
  return slugify(kebabCase(input));
}

export function toArray(param: { [x: string]: any; }) {
  if (param && typeof param === "object")
    return Object.keys(param).map((key) => param[key]);
  return undefined;
}

export function hasProperty(obj: { [x: string]: any; }, prop: string) {
  return (
    !!(obj && obj[prop]) ||
    (obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, prop))
  );
}

export function hasMethod(obj: { [x: string]: any; }, prop: string) {
  return hasProperty(obj, prop) && typeof obj[prop] === "function";
}