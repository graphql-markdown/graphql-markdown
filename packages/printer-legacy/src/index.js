const {
  string: { toSlug, escapeMDX },
  object: { hasProperty, hasMethod },
  url: { pathUrl },
  graphql: {
    isEnumType,
    isUnionType,
    isObjectType,
    isScalarType,
    isOperation,
    getDefaultValue,
    getTypeName,
    getFields,
    isDirectiveType,
    isParametrizedField,
    isInterfaceType,
    getNamedType,
    isInputType,
    isListType,
    isNonNullType,
    isLeafType,
    getRelationOfReturn,
    getRelationOfField,
    getRelationOfImplementation,
    hasDirective,
  },
} = require("@graphql-markdown/utils");

const {
  ROOT_TYPE_LOCALE,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
  NO_DESCRIPTION_TEXT,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} = require("./const/strings");
const mdx = require("./const/mdx");

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

  getRootTypeLocaleFromString(text) {
    for (const [type, props] of Object.entries(ROOT_TYPE_LOCALE)) {
      if (Object.values(props).includes(text)) {
        return ROOT_TYPE_LOCALE[type];
      }
    }
    return undefined;
  }

  getLinkCategory(graphLQLNamedType) {
    switch (true) {
      case isEnumType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.ENUM;
      case isUnionType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.UNION;
      case isInterfaceType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.INTERFACE;
      case isObjectType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.TYPE;
      case isInputType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.INPUT;
      case isScalarType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.SCALAR;
      case isDirectiveType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.DIRECTIVE;
      case isOperation(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.OPERATION;
    }
    return undefined;
  }

  getGroup(type) {
    if (typeof this.groups === "undefined") {
      return "";
    }
    const graphLQLNamedType = getNamedType(type);
    const typeName = graphLQLNamedType.name || graphLQLNamedType;
    return hasProperty(this.groups, typeName)
      ? toSlug(this.groups[typeName])
      : "";
  }

  toLink(type, name, operation) {
    const fallback = {
      text: name,
      url: "#",
    };

    if (hasDirective(type, this.skipDocDirective)) {
      return fallback;
    }

    const graphLQLNamedType = getNamedType(type);

    let category = this.getLinkCategory(graphLQLNamedType);

    if (
      typeof category === "undefined" ||
      typeof graphLQLNamedType === "undefined" ||
      graphLQLNamedType === null
    ) {
      return fallback;
    }

    // special case for support relation map
    if (category === ROOT_TYPE_LOCALE.OPERATION) {
      if (typeof operation === "undefined") {
        return fallback;
      }
      category = operation;
    }

    const text = graphLQLNamedType.name || graphLQLNamedType;
    const group = this.getGroup(type);
    const url = pathUrl.join(
      this.linkRoot,
      this.baseURL,
      group,
      category.plural,
      toSlug(text),
    );

    return {
      text: text,
      url: url,
    };
  }

  getRelationLink(category, type) {
    if (typeof category === "undefined") {
      return "";
    }
    const link = this.toLink(type, type.name, category);
    return `[\`${link.text}\`](${link.url})  <Badge class="secondary" text="${category.singular}"/>`;
  }

  printSection(
    values,
    section,
    { level, parentType } = {
      level: HEADER_SECTION_LEVEL,
      parentType: undefined,
    },
  ) {
    if (values.length === 0) {
      return "";
    }

    if (typeof level === "undefined") {
      level = HEADER_SECTION_LEVEL;
    }

    return `${level} ${section}${MARKDOWN_EOP}${this.printSectionItems(values, {
      parentType,
    })}${MARKDOWN_EOP}`;
  }

  printSectionItems(
    values,
    { level, parentType } = {
      level: HEADER_SECTION_SUB_LEVEL,
      parentType: undefined,
    },
  ) {
    if (!Array.isArray(values)) {
      return "";
    }

    if (typeof level === "undefined") {
      level = HEADER_SECTION_SUB_LEVEL;
    }

    return values
      .map((v) => v && this.printSectionItem(v, { level, parentType }))
      .join(MARKDOWN_EOP);
  }

  printLinkAttributes(type, text) {
    if (typeof type === "undefined") {
      return text ?? "";
    }

    if (!isLeafType(type, text) && typeof type.ofType != "undefined") {
      text = this.printLinkAttributes(type.ofType, text);
    }

    if (isListType(type)) {
      return `[${text}]`;
    }

    if (isNonNullType(type)) {
      return `${text}!`;
    }

    return text;
  }

  printLink(type, withAttributes = false, parentType = undefined) {
    const link = this.toLink(type, getTypeName(type));

    if (!withAttributes) {
      const printParentType =
        this.parentTypePrefix && typeof parentType !== "undefined";
      const text = printParentType
        ? `<code style={{ fontWeight: 'normal' }}>${parentType}.<b>${link.text}</b></code>`
        : `\`${link.text}\``;
      return `[${text}](${link.url})`;
    }

    const text = this.printLinkAttributes(type, link.text);

    return `[\`${text}\`](${link.url})`;
  }

  getTypeBadges(type) {
    const rootType = hasProperty(type, "type") ? type.type : type;

    const badges = [];

    if (type.isDeprecated) {
      badges.push("deprecated");
    }

    if (isNonNullType(rootType)) {
      badges.push("non-null");
    }

    if (isListType(rootType)) {
      badges.push("list");
    }

    const category = this.getLinkCategory(getNamedType(rootType));
    if (typeof category !== "undefined") {
      badges.push(category);
    }

    const group = this.getGroup(rootType);
    if (group !== "") {
      badges.push(group);
    }

    return badges;
  }

  printBadges(type) {
    if (!this.typeBadges) {
      return "";
    }

    const badges = this.getTypeBadges(type);

    if (badges.length === 0) {
      return "";
    }

    return badges
      .map(
        (badge) =>
          `<Badge class="secondary" text="${badge.singular ?? badge}"/>`,
      )
      .join(" ");
  }

  printParentLink(type) {
    return hasProperty(type, "type")
      ? `<Bullet />${this.printLink(type.type, true)}`
      : "";
  }

  printSectionItem(
    type,
    { level, parentType } = {
      level: HEADER_SECTION_SUB_LEVEL,
      parentType: undefined,
    },
  ) {
    if (typeof type === "undefined" || type === null) {
      return "";
    }

    if (typeof level === "undefined") {
      level = HEADER_SECTION_SUB_LEVEL;
    }

    const typeNameLink = this.printLink(type, false, parentType);
    const description = this.printDescription(type, "");
    const badges = this.printBadges(type);
    const parentTypeLink = this.printParentLink(type);

    let section = `${level} ${typeNameLink}${parentTypeLink} ${badges}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
    if (isParametrizedField(type)) {
      section += this.printSectionItems(type.args, {
        level: HEADER_SECTION_ITEM_LEVEL,
        parentType:
          typeof parentType === "undefined"
            ? undefined
            : `${parentType}.${type.name}`,
      });
    }

    return section;
  }

  printCodeEnum(type) {
    if (!isEnumType(type)) {
      return "";
    }

    let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
    code += type
      .getValues()
      .map((v) => `  ${getTypeName(v)}`)
      .join(MARKDOWN_EOL);
    code += `${MARKDOWN_EOL}}`;

    return code;
  }

  printCodeUnion(type) {
    if (!isUnionType(type)) {
      return "";
    }

    let code = `union ${getTypeName(type)} = `;
    code += type
      .getTypes()
      .map((v) => getTypeName(v))
      .join(" | ");

    return code;
  }

  printCodeScalar(type) {
    return `scalar ${getTypeName(type)}`;
  }

  printCodeArguments(type) {
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
  }

  printCodeField(type) {
    let code = `${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    code += `: ${getTypeName(type.type)}${MARKDOWN_EOL}`;

    return code;
  }

  printCodeDirectiveLocation(type) {
    if (
      typeof type.locations === "undefined" ||
      type.locations == null ||
      type.locations.length === 0
    ) {
      return "";
    }

    let code = ` on `;
    const separator = `\r\n  | `;
    if (type.locations.length > 1) {
      code += separator;
    }
    code += type.locations.join(separator).trim();

    return code;
  }

  printCodeDirective(type) {
    let code = `directive @${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    code += this.printCodeDirectiveLocation(type);

    return code;
  }

  printCodeType(type) {
    let entity;

    switch (true) {
      case isInputType(type):
        entity = "input";
        break;
      case isInterfaceType(type):
        entity = "interface";
        break;
      default:
        entity = "type";
    }

    const name = getTypeName(type);
    const extendsInterface =
      hasMethod(type, "getInterfaces") && type.getInterfaces().length > 0
        ? ` implements ${type
            .getInterfaces()
            .map((field) => getTypeName(field))
            .join(", ")}`
        : "";
    const typeFields = getFields(type)
      .map((v) => `  ${this.printCodeField(v)}`)
      .join("");

    return `${entity} ${name}${extendsInterface} {${MARKDOWN_EOL}${typeFields}}`;
  }

  printHeader(id, title, options) {
    const { toc, pagination } = { toc: true, pagination: true, ...options };
    const pagination_buttons = pagination
      ? ""
      : `pagination_next: null${MARKDOWN_EOL}pagination_prev: null${MARKDOWN_EOL}`;
    return `---${MARKDOWN_EOL}id: ${id}${MARKDOWN_EOL}title: ${title}\nhide_table_of_contents: ${!toc}${MARKDOWN_EOL}${pagination_buttons}---${MARKDOWN_EOL}`;
  }

  printDeprecation(type) {
    if (!type.isDeprecated) {
      return "";
    }

    const reason = type.deprecationReason
      ? ": " + escapeMDX(type.deprecationReason)
      : "";
    return `<Badge class="warning" text="DEPRECATED${reason}"/>${MARKDOWN_EOP}`;
  }

  printDescription(type, noText = NO_DESCRIPTION_TEXT) {
    const description =
      hasProperty(type, "description") && escapeMDX(type.description);
    return `${this.printDeprecation(type)}${description || noText}`;
  }

  printSpecification(type) {
    if (!type.specifiedByURL && !type.specifiedByUrl) {
      return "";
    }

    const url = type.specifiedByURL || type.specifiedByUrl;

    // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
    return `${HEADER_SECTION_LEVEL} <SpecifiedBy url="${url}"/>${MARKDOWN_EOP}`;
  }

  printCode(type) {
    let code = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;
    switch (true) {
      case isOperation(type):
        code += this.printCodeField(type);
        break;
      case isEnumType(type):
        code += this.printCodeEnum(type);
        break;
      case isUnionType(type):
        code += this.printCodeUnion(type);
        break;
      case isInterfaceType(type):
      case isObjectType(type):
      case isInputType(type):
        code += this.printCodeType(type);
        break;
      case isScalarType(type):
        code += this.printCodeScalar(type);
        break;
      case isDirectiveType(type):
        code += this.printCodeDirective(type);
        break;
      default:
        code += `"${getTypeName(type)}" not supported`;
    }
    return code.trim() + `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}`;
  }

  printTypeMetadata(type) {
    let metadata;

    switch (true) {
      case isScalarType(type):
        return this.printSpecification(type);
      case isEnumType(type):
        return this.printSection(type.getValues(), "Values", {
          parentType: type.name,
        });
      case isUnionType(type):
        return this.printSection(type.getTypes(), "Possible types");
      case isObjectType(type):
      case isInterfaceType(type):
      case isInputType(type): {
        metadata = this.printSection(getFields(type), "Fields", {
          parentType: type.name,
        });
        if (hasMethod(type, "getInterfaces")) {
          metadata += this.printSection(type.getInterfaces(), "Interfaces");
        }
        return metadata;
      }
      case isDirectiveType(type): {
        metadata = this.printSection(type.args, "Arguments", {
          parentType: type.name,
        });
        return metadata;
      }
      case isOperation(type): {
        metadata = this.printSection(type.args, "Arguments", {
          parentType: type.name,
        });
        const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
        metadata += this.printSection([this.schema.getType(queryType)], "Type");

        return metadata;
      }
      default:
        return metadata;
    }
  }

  printRelations(type) {
    const relations = {
      "Returned by": getRelationOfReturn,
      "Member of": getRelationOfField,
      "Implemented by": getRelationOfImplementation,
    };

    let data = "";
    for (const [section, getRelation] of Object.entries(relations)) {
      data += this.printRelationOf(type, section, getRelation);
    }

    return data;
  }

  printRelationOf(type, section, getRelation) {
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

      const category = this.getRootTypeLocaleFromString(relation);
      data = data.concat(types.map((t) => this.getRelationLink(category, t)));
    }

    if (data.length === 0) {
      return "";
    }

    const content = [...data]
      .sort((a, b) => a.localeCompare(b))
      .join("<Bullet />");

    return `${HEADER_SECTION_LEVEL} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
  }

  printType(name, type, options) {
    if (typeof type === "undefined" || type === null) {
      return "";
    }

    const header = this.printHeader(name, getTypeName(type), options);
    const description = this.printDescription(type);
    const code = this.printCode(type);
    const metadata = this.printTypeMetadata(type);
    const relations = this.relatedTypeSection ? this.printRelations(type) : "";

    return `${header}${MARKDOWN_EOP}${mdx}${MARKDOWN_EOP}${description}${MARKDOWN_EOP}${code}${MARKDOWN_EOP}${metadata}${MARKDOWN_EOP}${relations}${MARKDOWN_EOP}`;
  }
};
