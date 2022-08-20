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
const HEADER_SECTION_ITEM_LEVEL = "- #####";
const NO_DESCRIPTION_TEXT = "No description";
const MARKDOWN_EOL = "\n";
const MARKDOWN_EOP = "\n\n";
const BULLET_SEPARATOR =
  "<span style={{ fontWeight: 'normal', fontSize: '.5em', color: 'var(--ifm-color-secondary-darkest)' }}>●</span>";

module.exports = {
  ROOT_TYPE_LOCALE,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
  NO_DESCRIPTION_TEXT,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  BULLET_SEPARATOR,
};
