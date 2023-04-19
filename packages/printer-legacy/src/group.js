const {
  string: { toSlug },
  object: { hasProperty },
  graphql: { getNamedType },
} = require("@graphql-markdown/utils");

const getGroup = (type, groups, typeCategory) => {
  if (typeof groups !== "object" || groups === null) {
    return "";
  }
  const graphLQLNamedType = getNamedType(type);
  const typeName = graphLQLNamedType.name || graphLQLNamedType;
  return hasProperty(groups, typeCategory) &&
    hasProperty(groups[typeCategory], typeName)
    ? toSlug(groups[typeCategory][typeName])
    : "";
};

module.exports = {
  getGroup,
};
