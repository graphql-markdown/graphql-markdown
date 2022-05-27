const {
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
  isNullableType,
} = require("./graphql");

const { toSlug, escapeMDX } = require("../utils/scalars/string");
const { hasProperty, hasMethod } = require("../utils/scalars/object");
const { pathUrl } = require("../utils/scalars/url");

const HEADER_SECTION_LEVEL = "###";
const HEADER_SECTION_SUB_LEVEL = "####";
const HEADER_SECTION_ITEM_LEVEL = "- #####";
const NO_DESCRIPTION_TEXT = "No description";
const MARKDOWN_EOL = "\n";
const MARKDOWN_EOP = "\n\n";

module.exports = class Printer {
  constructor(schema, baseURL, linkRoot = "/", group = undefined) {
    this.schema = schema;
    this.baseURL = baseURL;
    this.linkRoot = linkRoot;
    this.group = group;
  }

  getLinkCategory(graphLQLNamedType) {
    switch (true) {
      case isEnumType(graphLQLNamedType):
        return "enums";
      case isUnionType(graphLQLNamedType):
        return "unions";
      case isInterfaceType(graphLQLNamedType):
        return "interfaces";
      case isObjectType(graphLQLNamedType):
        return "objects";
      case isInputType(graphLQLNamedType):
        return "inputs";
      case isScalarType(graphLQLNamedType):
        return "scalars";
      case isDirectiveType(graphLQLNamedType):
        return "directives";
    }
    return undefined;
  }

  toLink(type, name) {
    const graphLQLNamedType = isListType(type)
      ? getNamedType(type.ofType)
      : getNamedType(type);

    const category = this.getLinkCategory(graphLQLNamedType);

    if (
      typeof category === "undefined" ||
      typeof graphLQLNamedType === "undefined" ||
      graphLQLNamedType === null
    ) {
      return {
        text: name,
        url: "#",
      };
    }

    const text = graphLQLNamedType.name || graphLQLNamedType;
    const group = toSlug(hasProperty(this.group, text) ? this.group[text] : "");
    const url = pathUrl.join(
      this.linkRoot,
      this.baseURL,
      group,
      category,
      toSlug(name),
    );

    return {
      text: text,
      url: url,
    };
  }

  printSection(values, section, level = HEADER_SECTION_LEVEL) {
    if (values.length === 0) {
      return "";
    }

    return `${level} ${section}${MARKDOWN_EOP}${this.printSectionItems(
      values,
    )}${MARKDOWN_EOP}`;
  }

  printSectionItems(values, level = HEADER_SECTION_SUB_LEVEL) {
    if (!Array.isArray(values)) {
      return "";
    }

    return values
      .map((v) => v && this.printSectionItem(v, level))
      .join(MARKDOWN_EOP);
  }

  printLink(type, withAttributes = false) {
    const link = this.toLink(type, getTypeName(type));

    if (!withAttributes) {
      return `[\`${link.text}\`](${link.url})`;
    }

    const nullableFlag = isNullableType(type) ? "" : "!";
    const text = isListType(type)
      ? `[${link.text}${nullableFlag}]`
      : `${link.text}${nullableFlag}`;
    return `[\`${text}\`](${link.url})`;
  }

  printSectionItem(type, level = HEADER_SECTION_SUB_LEVEL) {
    if (typeof type === "undefined" || type === null) {
      return "";
    }

    const typeNameLink = this.printLink(type);
    const description = this.printDescription(type, "");
    const parentTypeLink = hasProperty(type, "type")
      ? ` (${this.printLink(type.type, true)})`
      : "";

    let section = `${level} ${typeNameLink}${parentTypeLink}${MARKDOWN_EOP}${description}${MARKDOWN_EOL}`;
    if (isParametrizedField(type)) {
      section += this.printSectionItems(type.args, HEADER_SECTION_ITEM_LEVEL);
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

  printCodeDirective(type) {
    let code = `directive @${getTypeName(type)}`;
    code += this.printCodeArguments(type);

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
    return `<span class="badge badge--warning">DEPRECATED${reason}</span>${MARKDOWN_EOP}`;
  }

  printDescription(type, noText = NO_DESCRIPTION_TEXT) {
    const description =
      hasProperty(type, "description") && escapeMDX(type.description);
    return `${this.printDeprecation(type)}${description || noText}`;
  }

  printSpecification(type) {
    if (!type.specifiedByUrl) {
      return "";
    }

    // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
    return `
export const specifiedByLinkCss = { fontSize:'1.5em', paddingLeft:'4px' };

${HEADER_SECTION_LEVEL} Specification<a className="link" style={specifiedByLinkCss} target="_blank" href="${type.specifiedByUrl}" title="Specified by ${type.specifiedByUrl}">⎘</a>${MARKDOWN_EOP}
      `;
  }

  printCode(type) {
    let code = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;
    switch (true) {
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
      case isOperation(type):
        code += this.printCodeField(type);
        break;
      default:
        code += `"${getTypeName(type)}" not supported`;
    }
    return code.trim() + `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}`;
  }

  printType(name, type, options) {
    if (typeof type === "undefined" || type === null) {
      return "";
    }

    const header = this.printHeader(name, getTypeName(type), options);
    const description = this.printDescription(type);
    const code = this.printCode(type);

    let metadata = "";
    if (isScalarType(type)) {
      metadata = this.printSpecification(type);
    }

    if (isEnumType(type)) {
      metadata = this.printSection(type.getValues(), "Values");
    }

    if (isUnionType(type)) {
      metadata = this.printSection(type.getTypes(), "Possible types");
    }

    if (isObjectType(type) || isInterfaceType(type) || isInputType(type)) {
      metadata = this.printSection(getFields(type), "Fields");
      if (hasMethod(type, "getInterfaces")) {
        metadata += this.printSection(type.getInterfaces(), "Interfaces");
      }
    }

    if (isDirectiveType(type) || isOperation(type)) {
      metadata = this.printSection(type.args, "Arguments");
    }

    if (isOperation(type)) {
      const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
      metadata += this.printSection([this.schema.getType(queryType)], "Type");
    }

    return `${header}${MARKDOWN_EOP}${description}${MARKDOWN_EOP}${code}${MARKDOWN_EOP}${metadata}${MARKDOWN_EOP}`;
  }
};
