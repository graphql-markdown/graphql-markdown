const {
  string: { escapeMDX },
  object: { hasProperty },
  graphql: {
    isEnumType,
    isUnionType,
    isObjectType,
    isScalarType,
    isOperation,
    getDefaultValue,
    getTypeName,
    isDirectiveType,
    isParametrizedField,
    isInterfaceType,
    isInputType,
    isListType,
    isNonNullType,
    isLeafType,
    getRelationOfReturn,
    getRelationOfField,
    getRelationOfImplementation,
  },
} = require("@graphql-markdown/utils");

const {
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
  NO_DESCRIPTION_TEXT,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} = require("./const/strings");
const {
  getRootTypeLocaleFromString,
  getRelationLink,
  toLink,
} = require("./utils");

const printSection = (
  values,
  section,
  { level, parentType } = {
    level: HEADER_SECTION_LEVEL,
    parentType: undefined,
  },
) => {
  if (values.length === 0) {
    return "";
  }

  if (typeof level === "undefined") {
    level = HEADER_SECTION_LEVEL;
  }

  return `${level} ${section}${MARKDOWN_EOP}${printSectionItems(values, {
    parentType,
  })}${MARKDOWN_EOP}`;
};

const printSectionItems = (
  values,
  { level, parentType } = {
    level: HEADER_SECTION_SUB_LEVEL,
    parentType: undefined,
  },
) => {
  if (!Array.isArray(values)) {
    return "";
  }

  if (typeof level === "undefined") {
    level = HEADER_SECTION_SUB_LEVEL;
  }

  return values
    .map((v) => v && printSectionItem(v, { level, parentType }))
    .join(MARKDOWN_EOP);
};

const printLinkAttributes = (type, text) => {
  if (typeof type === "undefined") {
    return text ?? "";
  }

  if (!isLeafType(type, text) && typeof type.ofType != "undefined") {
    text = printLinkAttributes(type.ofType, text);
  }

  if (isListType(type)) {
    return `[${text}]`;
  }

  if (isNonNullType(type)) {
    return `${text}!`;
  }

  return text;
};

const printLink = (type, withAttributes = false, parentType = undefined) => {
  const link = toLink(type, getTypeName(type));

  if (!withAttributes) {
    const printParentType =
      this.parentTypePrefix && typeof parentType !== "undefined";
    const text = printParentType
      ? `<code style={{ fontWeight: 'normal' }}>${parentType}.<b>${link.text}</b></code>`
      : `\`${link.text}\``;
    return `[${text}](${link.url})`;
  }

  const text = printLinkAttributes(type, link.text);

  return `[\`${text}\`](${link.url})`;
};

const printBadges = (type) => {
  if (!typeBadges) {
    return "";
  }

  const badges = getTypeBadges(type);

  if (badges.length === 0) {
    return "";
  }

  return badges
    .map(
      (badge) => `<Badge class="secondary" text="${badge.singular ?? badge}"/>`,
    )
    .join(" ");
};

const printParentLink = (type) => {
  return hasProperty(type, "type")
    ? `<Bullet />${printLink(type.type, true)}`
    : "";
};

const printSectionItem = (
  type,
  { level, parentType } = {
    level: HEADER_SECTION_SUB_LEVEL,
    parentType: undefined,
  },
) => {
  if (typeof type === "undefined" || type === null) {
    return "";
  }

  if (typeof level === "undefined") {
    level = HEADER_SECTION_SUB_LEVEL;
  }

  const typeNameLink = printLink(type, false, parentType);
  const description = printDescription(type, "");
  const badges = printBadges(type);
  const parentTypeLink = printParentLink(type);

  let section = `${level} ${typeNameLink}${parentTypeLink} ${badges}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
  if (isParametrizedField(type)) {
    section += printSectionItems(type.args, {
      level: HEADER_SECTION_ITEM_LEVEL,
      parentType:
        typeof parentType === "undefined"
          ? undefined
          : `${parentType}.${type.name}`,
    });
  }

  return section;
};

const printCodeArguments = (type) => {
  if (!hasProperty(type, "args") || type.args.length === 0) {
    return "";
  }

  let code = `(${MARKDOWN_EOL}`;
  code += type.args.reduce((r, v) => {
    const defaultValue = getDefaultValue(v);
    const hasDefaultValue =
      typeof defaultValue !== "undefined" && defaultValue !== null;
    const printedDefault = hasDefaultValue ? ` = ${getDefaultValue(v)}` : "";
    const propType = v.type.toString();
    const propName = v.name.toString();
    return `${r}  ${propName}: ${propType}${printedDefault}${MARKDOWN_EOL}`;
  }, "");
  code += `)`;

  return code;
};

const printCodeField = (type) => {
  let code = `${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += `: ${getTypeName(type.type)}${MARKDOWN_EOL}`;

  return code;
};

const printHeader = (id, title, options) => {
  const { toc, pagination } = { toc: true, pagination: true, ...options };
  const pagination_buttons = pagination
    ? ""
    : `pagination_next: null${MARKDOWN_EOL}pagination_prev: null${MARKDOWN_EOL}`;
  return `---${MARKDOWN_EOL}id: ${id}${MARKDOWN_EOL}title: ${title}\nhide_table_of_contents: ${!toc}${MARKDOWN_EOL}${pagination_buttons}---${MARKDOWN_EOL}`;
};

const printDeprecation = (type) => {
  if (!type.isDeprecated) {
    return "";
  }

  const reason = type.deprecationReason
    ? ": " + escapeMDX(type.deprecationReason)
    : "";
  return `<Badge class="warning" text="DEPRECATED${reason}"/>${MARKDOWN_EOP}`;
};

const printDescription = (type, noText = NO_DESCRIPTION_TEXT) => {
  const description =
    hasProperty(type, "description") && escapeMDX(type.description);
  return `${printDeprecation(type)}${description || noText}`;
};

const printSpecification = (type) => {
  if (!type.specifiedByURL && !type.specifiedByUrl) {
    return "";
  }

  const url = type.specifiedByURL || type.specifiedByUrl;

  // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
  return `${HEADER_SECTION_LEVEL} <SpecifiedBy url="${url}"/>${MARKDOWN_EOP}`;
};

const printCode = (type) => {
  let code = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;

  switch (true) {
    case isOperation(type):
      code += printCodeField(type);
      break;
    case isEnumType(type):
      code += printCodeEnum(type);
      break;
    case isUnionType(type):
      code += printCodeUnion(type);
      break;
    case isInterfaceType(type):
      code += printCodeInterface(type);
      break;
    case isObjectType(type):
      code += printCodeObject(type);
      break;
    case isInputType(type):
      code += printCodeInput(type);
      break;
    case isScalarType(type):
      code += printCodeScalar(type);
      break;
    case isDirectiveType(type):
      code += printCodeDirective(type);
      break;
    default:
      code += `"${getTypeName(type)}" not supported`;
  }

  return code.trim() + `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}`;
};

const printTypeMetadata = (type) => {
  let metadata;

  switch (true) {
    case isScalarType(type):
      return printScalarMetadata(type);
    case isEnumType(type):
      return printEnumMetadata(type);
    case isUnionType(type):
      return printUnionMetadata(type);
    case isObjectType(type):
      return printObjectMetadata(type);
    case isInterfaceType(type):
      return printInterfaceMetadata(type);
    case isInputType(type):
      return printInputMetadata(type);
    case isDirectiveType(type):
      return printDirectiveMetadata(type);
    case isOperation(type):
      return printOperationMetadata(type);
    default:
      return metadata;
  }
};

const printRelations = (type) => {
  const relations = {
    "Returned by": getRelationOfReturn,
    "Member of": getRelationOfField,
    "Implemented by": getRelationOfImplementation,
  };

  let data = "";
  for (const [section, getRelation] of Object.entries(relations)) {
    data += printRelationOf(type, section, getRelation);
  }

  return data;
};

const printRelationOf = (type, section, getRelation) => {
  if (
    typeof type === "undefined" ||
    typeof getRelation !== "function" ||
    isOperation(type)
  ) {
    return "";
  }

  const relations = getRelation(type, this.schema);

  if (typeof relations === "undefined") {
    return "";
  }

  let data = [];
  for (const [relation, types] of Object.entries(relations)) {
    if (types.length === 0) {
      continue;
    }

    const category = getRootTypeLocaleFromString(relation);
    data = data.concat(types.map((t) => getRelationLink(category, t)));
  }

  if (data.length === 0) {
    return "";
  }

  const content = [...data]
    .sort((a, b) => a.localeCompare(b))
    .join("<Bullet />");

  return `${HEADER_SECTION_LEVEL} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
};

module.exports = {
  printHeader,
  printDescription,
  printCode,
  printTypeMetadata,
  printRelations,
};
