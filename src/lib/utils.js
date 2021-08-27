const pathUrl = require("path").posix;

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
    !!(obj && obj[prop]) ||
    (obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, prop))
  );
}

function hasMethod(obj, prop) {
  return hasProperty(obj, prop) && typeof obj[prop] === "function";
}

module.exports = { round, startCase, toSlug, toArray, hasProperty, hasMethod, pathUrl };
