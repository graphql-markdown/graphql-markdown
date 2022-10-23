const {
  array: { convertArrayToObject },
} = require("@graphql-markdown/utils").scalars;

const DEFAULT_GROUP = "Miscellaneous";
const OPTION_REGEX =
  /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

function parseGroupByOption(groupOptions) {
  if (typeof groupOptions !== "string") {
    return undefined;
  }

  const parsedOptions = OPTION_REGEX.exec(groupOptions);

  if (typeof parsedOptions === "undefined" || parsedOptions == null) {
    throw new Error(`Invalid "${groupOptions}"`);
  }

  const { directive, field, fallback = DEFAULT_GROUP } = parsedOptions.groups;
  return { directive, field, fallback };
}

function getGroups(rootTypes, groupByDirective) {
  let groups = {};

  if (typeof groupByDirective === "undefined" || groupByDirective == null) {
    return undefined;
  }

  Object.keys(rootTypes).forEach((typeName) => {
    let rootType = rootTypes[typeName];
    if (typeof rootType != "undefined" && rootType != null) {
      if (Array.isArray(rootType)) {
        rootType = convertArrayToObject(rootType);
      }

      Object.keys(rootType).forEach((type) => {
        groups[type] = getGroupName(rootType[type], groupByDirective);
      });
    }
  });

  return groups;
}

function getGroupName(type, groupByDirective) {
  let group = groupByDirective.fallback; // default value is fallback, and it will be only overridden if a group is found

  if (typeof type.astNode === "undefined" || type.astNode == null) {
    return group;
  }

  const allDirectives = type.astNode.directives;

  if (!Array.isArray(allDirectives)) {
    return group;
  }

  for (const directive of allDirectives) {
    if (directive.name.value !== groupByDirective.directive) {
      continue;
    }
    const field = directive.arguments.find(
      ({ name }) => name.value === groupByDirective.field,
    );
    return field.value.value;
  }

  return group;
}

module.exports = { getGroupName, getGroups, parseGroupByOption };
