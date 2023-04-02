const ROOT_TYPE_LOCALE = {
  QUERY: { singular: "query", plural: "queries" },
  MUTATION: { singular: "mutation", plural: "mutations" },
  SUBSCRIPTION: { singular: "subscription", plural: "subscriptions" },
  TYPE: { singular: "object", plural: "objects" },
  INTERFACE: { singular: "interface", plural: "interfaces" },
  DIRECTIVE: { singular: "directive", plural: "directives" },
  SCALAR: { singular: "scalar", plural: "scalars" },
  ENUM: { singular: "enum", plural: "enums" },
  OPERATION: { singular: "operation", plural: "operations" },
  UNION: { singular: "union", plural: "unions" },
  INPUT: { singular: "input", plural: "inputs" },
};

const HEADER_SECTION_LEVEL = "###";
const HEADER_SECTION_SUB_LEVEL = "####";
const HEADER_SECTION_ITEM_LEVEL = "#####";
const NO_DESCRIPTION_TEXT = "No description";
const MARKDOWN_EOL = "\n";
const MARKDOWN_EOP = "\n\n";
const MARKDOWN_SOC = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;
const MARKDOWN_EOC = `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}`;
const FRONT_MATTER = "---";

const DEPRECATED = "deprecated";

module.exports = {
  ROOT_TYPE_LOCALE,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
  NO_DESCRIPTION_TEXT,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  MARKDOWN_SOC,
  MARKDOWN_EOC,
  FRONT_MATTER,
  DEPRECATED,
};
