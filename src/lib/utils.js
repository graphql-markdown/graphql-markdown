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

function convertArrayToObject(typeArray) {
  return typeArray.reduce(function (r, o) {
    if (o && o.name) r[o.name] = o;
    return r;
  }, {});
}

module.exports = {
  escapeMDX,
  round,
  startCase,
  toSlug,
  toArray,
  hasProperty,
  hasMethod,
  pathUrl,
  convertArrayToObject,
};
