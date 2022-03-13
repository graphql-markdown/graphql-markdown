const { convertArrayToObject } = require("../utils/scalars/array");

const DEFAULT_GROUP = "Miscellaneous";
const OPTION_REGEX =
  /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

function parseGroupInfoOption(groupByDirective) {
  if (typeof groupByDirective !== "string") {
    return undefined;
  }

  const { groups: parsedOptions = undefined } =
    OPTION_REGEX.exec(groupByDirective);

  if (typeof parsedOptions == "undefined" || parsedOptions == null) {
    throw new Error(`Invalid "${groupByDirective}"`);
  }

  const { directive, field, fallback = DEFAULT_GROUP } = parsedOptions;
  return { directive, field, fallback };
}

function getGroups(rootTypes, groupByDirective) {
  let groups = {};

  if (typeof groupByDirective == "undefined" || groupByDirective == null) {
    return undefined;
  }

  Object.keys(rootTypes).forEach((typeName) => {
    if (
      typeof rootTypes[typeName] != "undefined" &&
      rootTypes[typeName] != null
    ) {
      if (Array.isArray(rootTypes[typeName])) {
        rootTypes[typeName] = convertArrayToObject(rootTypes[typeName]);
      }

      Object.keys(rootTypes[typeName]).forEach((name) => {
        if (
          typeof rootTypes[typeName][name]["astNode"] != "undefined" &&
          rootTypes[typeName][name]["astNode"] != null
        ) {
          const allDirectives =
            rootTypes[typeName][name]["astNode"]["directives"];
          groups[name] = getGroupInfo(allDirectives, groupByDirective);
        } else {
          groups[name] = groupByDirective.fallback;
        }
      });
    }
  });

  return groups;
}

function getGroupInfo(allDirectives, groupByDirective) {
  let group = groupByDirective.fallback; // default value is fallback, and it will be only overridden if a group is found

  if (!Array.isArray(allDirectives)) {
    return group;
  }

  for (const directive of allDirectives) {
    if (directive.name.value === groupByDirective.directive) {
      const field = directive.arguments.find(
        ({ name }) => name.value === groupByDirective.field,
      );
      group = field.value.value;
      break;
    }
  }

  return group;
}

module.exports = { getGroups, parseGroupInfoOption };
