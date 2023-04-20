function getGroups(rootTypes, groupByDirective) {
  const groups = {};

  if (typeof groupByDirective === "undefined" || groupByDirective == null) {
    return undefined;
  }

  Object.keys(rootTypes).forEach((typeName) => {
    const rootType = rootTypes[typeName];
    if (typeof rootType !== "undefined" && rootType !== null) {
      if (typeof groups[typeName] === "undefined") {
        groups[typeName] = {};
      }
      Object.keys(rootType).forEach((type) => {
        groups[typeName][type] = getGroupName(rootType[type], groupByDirective);
      });
    }
  });

  return groups;
}

function getGroupName(type, groupByDirective) {
  if (typeof type.astNode === "undefined" || type.astNode == null) {
    return groupByDirective.fallback;
  }

  const allDirectives = type.astNode.directives;

  if (!Array.isArray(allDirectives)) {
    return groupByDirective.fallback;
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

  return groupByDirective.fallback;
}

module.exports = { getGroupName, getGroups };
