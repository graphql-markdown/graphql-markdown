const ROOT_TYPE_LOCALE = {
  DIRECTIVE: { singular: "directive", plural: "directives" },
  ENUM: { singular: "enum", plural: "enums" },
  INPUT: { singular: "input", plural: "inputs" },
  INTERFACE: { singular: "interface", plural: "interfaces" },
  MUTATION: { singular: "mutation", plural: "mutations" },
  OPERATION: { singular: "operation", plural: "operations" },
  QUERY: { singular: "query", plural: "queries" },
  SCALAR: { singular: "scalar", plural: "scalars" },
  SUBSCRIPTION: { singular: "subscription", plural: "subscriptions" },
  TYPE: { singular: "object", plural: "objects" },
  UNION: { singular: "union", plural: "unions" },
};

const HEADER_SECTION_ITEM_LEVEL = "#####";
const HEADER_SECTION_LEVEL = "###";
const HEADER_SECTION_SUB_LEVEL = "####";

const NO_DESCRIPTION_TEXT = "No description";

const FRONT_MATTER = "---";
const MARKDOWN_CODE_INDENTATION = "  ";
const MARKDOWN_EOL = "\n";
const MARKDOWN_EOP = "\n\n";
const MARKDOWN_EOC = `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}`;
const MARKDOWN_SOC = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;

const DEPRECATED = "deprecated";

const HIDE_DEPRECATED = `<><span className="deprecated">Hide deprecated</span></>`;
const SHOW_DEPRECATED = `<><span className="deprecated">Show deprecated</span></>`;

module.exports = {
  DEPRECATED,
  FRONT_MATTER,
  HEADER_SECTION_ITEM_LEVEL,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HIDE_DEPRECATED,
  MARKDOWN_CODE_INDENTATION,
  MARKDOWN_EOC,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  MARKDOWN_SOC,
  NO_DESCRIPTION_TEXT,
  ROOT_TYPE_LOCALE,
  SHOW_DEPRECATED,
};
