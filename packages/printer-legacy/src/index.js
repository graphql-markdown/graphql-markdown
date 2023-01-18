const {
  graphql: { getTypeName },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOP } = require("./const/strings");
const mdx = require("./const/mdx");
const {
  printHeader,
  printDescription,
  printCode,
  printTypeMetadata,
  printRelations,
} = require("./common");

module.exports = class Printer {
  constructor(
    schema,
    baseURL,
    linkRoot = "/",
    { groups, printTypeOptions, skipDocDirective } = {
      groups: undefined,
      printTypeOptions: undefined,
      skipDocDirective: undefined,
    },
  ) {
    this.schema = schema;
    this.baseURL = baseURL;
    this.linkRoot = linkRoot;
    this.groups = groups;
    this.parentTypePrefix = printTypeOptions?.parentTypePrefix ?? true;
    this.relatedTypeSection = printTypeOptions?.relatedTypeSection ?? true;
    this.typeBadges = printTypeOptions?.typeBadges ?? true;
    this.skipDocDirective = skipDocDirective ?? undefined;
  }

  printType = (name, type, options) => {
    if (typeof type === "undefined" || type === null) {
      return "";
    }

    const header = printHeader(name, getTypeName(type), options);
    const description = printDescription(type);
    const code = printCode(type);
    const metadata = printTypeMetadata(type);
    const relations = relatedTypeSection ? printRelations(type) : "";

    return `${header}${MARKDOWN_EOP}${mdx}${MARKDOWN_EOP}${description}${MARKDOWN_EOP}${code}${MARKDOWN_EOP}${metadata}${MARKDOWN_EOP}${relations}${MARKDOWN_EOP}`;
  };
};
