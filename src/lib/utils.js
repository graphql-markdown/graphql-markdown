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

function setUpCategorizationInfo(
  rootTypes,
  directiveToGroupBy,
  directiveFieldForGrouping,
  linkRoot,
) {
  Object.keys(rootTypes).forEach((typeName) => {
    if (rootTypes[typeName]) {
      if (Array.isArray(rootTypes[typeName])) {
        rootTypes[typeName] = rootTypes[typeName].reduce(function (r, o) {
          if (o && o.name) r[o.name] = o;
          return r;
        }, {});
      }
      let categoryInDirective;
      Object.keys(rootTypes[typeName]).forEach((name) => {
        let allDirectives = get(
          rootTypes[typeName][name],
          "astNode.directives",
        );
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
        categoryInDirective = categoryInDirective
          ? categoryInDirective
          : "Miscellaneous";
        docLocations[name] = {
          link: categoryInDirective
            ? `${pathUrl.join(linkRoot, categoryInDirective, typeName)}`
            : `${pathUrl.join(linkRoot, "Miscellaneous", typeName, name)}`,
          category: categoryInDirective,
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
