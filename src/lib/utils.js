const pathUrl = require("path").posix;

const slugify = require("slugify");
const round = require("lodash.round");

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

function toHTMLUnicode(char) {
  const unichar = char.charCodeAt(0).toString(16).padStart(4, "0");
  return `&#x${unichar.toUpperCase()};`;
}

function escapeMDX(str) {
  if (typeof str === "string") {
    return str.replace(/[<>{}]/g, toHTMLUnicode);
  }
  return str;
}

function firstUppercase(word) {
  const sliceUppercase = word.slice(0, 1).toUpperCase();
  const sliceDefaultcase = word.slice(1);
  return `${sliceUppercase}${sliceDefaultcase}`;
}

function capitalize(word) {
  return firstUppercase(word.toLowerCase());
}

function _stringCaseBuilder(str, transformation, separator) {
  return str
    .toString()
    .replace(/([a-z]+|[0-9]+)([A-Z])/g, "$1 $2")
    .replace(/([a-z]+)([0-9])/g, "$1 $2")
    .replace(/([0-9]+)([a-z])/g, "$1 $2")
    .split(/[^0-9A-Za-z]+/g)
    .map((word) => transformation(word))
    .join(separator);
}

function startCase(str) {
  return _stringCaseBuilder(str, firstUppercase, " ");
}

function kebabCase(str) {
  return _stringCaseBuilder(str, (word) => word.toLowerCase(), "-");
}

module.exports = {
  capitalize,
  escapeMDX,
  round,
  startCase,
  kebabCase,
  firstUppercase,
  toSlug,
  toArray,
  hasProperty,
  hasMethod,
  pathUrl,
};
