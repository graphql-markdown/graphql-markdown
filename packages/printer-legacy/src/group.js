const {
  string: { toSlug },
  object: { hasProperty },
  graphql: { getNamedType },
} = require("@graphql-markdown/utils");

const getGroup = (type, groups) => {
  if (typeof groups === "undefined") {
    return "";
  }
  const graphLQLNamedType = getNamedType(type);
  const typeName = graphLQLNamedType.name || graphLQLNamedType;
  return hasProperty(groups, typeName) ? toSlug(groups[typeName]) : "";
};

module.exports = {
  getGroup,
};
