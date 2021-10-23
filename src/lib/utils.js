const pathUrl = require("path").posix;
const { get } = require("lodash");
const slugify = require("slugify");
const { kebabCase, startCase, round } = require("lodash");
const docLocations = {};
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

function getCategory(
  allDirectives,
  directiveToGroupBy,
  directiveFieldForGrouping,
) {
  let categoryInDirective;
  if (allDirectives) {
    allDirectives.forEach((directive) => {
      if (
        directive.name.value === directiveToGroupBy &&
        directive.arguments.length > 0
      ) {
        directive.arguments.forEach((argument) => {
          if (argument.name.value === directiveFieldForGrouping) {
            categoryInDirective = argument.value.value;
          }
        });
      }
    });
  }
  return categoryInDirective ? categoryInDirective : "Miscellaneous";
}

function convertArrayToObject(typeArray) {
  return typeArray.reduce(function (r, o) {
    if (o && o.name) r[o.name] = o;
    return r;
  }, {});
}

function setUpCategorizationInfo(
  rootTypes,
  directiveToGroupBy,
  directiveFieldForGrouping,
  linkRoot,
) {
  let category;
  Object.keys(rootTypes).forEach((typeName) => {
    if (rootTypes[typeName]) {
      if (Array.isArray(rootTypes[typeName])) {
        rootTypes[typeName] = convertArrayToObject(rootTypes[typeName]);
      }
      Object.keys(rootTypes[typeName]).forEach((name) => {
        category = getCategory(
          get(rootTypes[typeName][name], "astNode.directives"),
          directiveToGroupBy,
          directiveFieldForGrouping,
        );
        docLocations[name] = {
          link: `${pathUrl.join(linkRoot, category, typeName)}`,
          category,
        };
      });
    }
  });
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
  docLocations,
  setUpCategorizationInfo,
};
