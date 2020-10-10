const slugify = require("slugify");
const { kebabCase, startCase, round } = require("lodash");

function toSlug(str) {
  return slugify(kebabCase(str));
}

function toArray(param) {
  if (param && typeof param === "object")
    return Object.keys(param).map((key) => param[key]);
  return undefined;
}

function hasProperty(obj, prop) {
  return (
    obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, prop)
  );
}

function hasMethod(obj, prop) {
  if (hasProperty(obj, prop)) {
    return typeof obj[prop] === "function";
  }
}

module.exports = { round, startCase, toSlug, toArray, hasProperty, hasMethod };
