const path = require("path");
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
} = require("./graphql");
const { toSlug, hasProperty, hasMethod } = require("./utils");
const { prettifyMarkdown } = require("./prettier");

const HEADER_SECTION_LEVEL = "###";
const HEADER_SECTION_SUB_LEVEL = "####";
const HEADER_SECTION_ITEM_LEVEL = "- #####";
const NO_DESCRIPTION_TEXT = "No description";

module.exports = class Printer {
  constructor(schema, baseURL, linkRoot = "/") {
    this.schema = schema;
    this.baseURL = baseURL;
    this.linkRoot = linkRoot;
  }

  toLink(type, name) {
    let graphLQLNamedType = getNamedType(type);
    if (isListType(type)) graphLQLNamedType = getNamedType(type.ofType);
    let category;
    switch (true) {
      case isEnumType(graphLQLNamedType):
        category = "enums";
        break;
      case isUnionType(graphLQLNamedType):
        category = "unions";
        break;
      case isInterfaceType(graphLQLNamedType):
        category = "interfaces";
        break;
      case isObjectType(graphLQLNamedType):
        category = "objects";
        break;
      case isInputType(graphLQLNamedType):
        category = "inputs";
        break;
      case isScalarType(graphLQLNamedType):
        category = "scalars";
        break;
      case isDirectiveType(graphLQLNamedType):
        category = "directives";
        break;
    }

    if (category && graphLQLNamedType) {
      return `[\`${name}\`](${path.join(
        this.linkRoot,
        this.baseURL,
        category,
        toSlug(graphLQLNamedType),
      )})`;
    } else {
      return `\`${name}\``;
    }
  }

  printSection(values, section, level = HEADER_SECTION_LEVEL) {
    if (values.length > 0)
      return `${level} ${section}\n\n${this.printSectionItems(values)}\n\n`;
    return "";
  }

  printSectionItems(values, level = HEADER_SECTION_SUB_LEVEL) {
    if (Array.isArray(values))
      return values
        .map((v) => v && this.printSectionItem(v, level))
        .join(`\n\n`);
    return "";
  }

  printSectionItem(type, level = HEADER_SECTION_SUB_LEVEL) {
    if (!type) {
      return "";
    }

    let section = `${level} ${this.toLink(type, getTypeName(type))} ${
      hasProperty(type, "type")
        ? `(${this.toLink(type.type, getTypeName(type.type))})`
        : ""
    }\n\n${this.printDescription(type, "")}\n`;
    if (isParametrizedField(type)) {
      section += this.printSectionItems(type.args, HEADER_SECTION_ITEM_LEVEL);
    }
    return section;
  }

  printCodeEnum(type) {
    let code = "";
    if (isEnumType(type)) {
      code += `enum ${getTypeName(type)} {\n`;
      code += type
        .getValues()
        .map((v) => `  ${getTypeName(v)}`)
        .join("\n");
      code += `\n}`;
    }
    return code;
  }

  printCodeUnion(type) {
    let code = "";
    if (isUnionType(type)) {
      code += `union ${getTypeName(type)} = `;
      code += type
        .getTypes()
        .map((v) => getTypeName(v))
        .join(" | ");
    }
    return code;
  }

  printCodeScalar(type) {
    return `scalar ${getTypeName(type)}`;
  }

  printCodeArguments(type) {
    let code = "";
    if (hasProperty(type, "args") && type.args.length > 0) {
      code += `(\n`;
      code += type.args.reduce((r, v) => {
        const defaultValue = getDefaultValue(v);
        return `${r}  ${v.name}: ${v.type.toString()}${
          defaultValue ? ` = ${defaultValue}` : ""
        }\n`;
      }, "");
      code += `)`;
    }
    return code;
  }

  printCodeField(type) {
    let code = `${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    code += `: ${getTypeName(type.type)}\n`;
    return code;
  }

  printCodeDirective(type) {
    let code = `directive @${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    return code;
  }

  printCodeType(type) {
    let code = `${isInterfaceType(type) ? "interface" : "type"} ${getTypeName(
      type,
    )}`;
    code += `${
      hasMethod(type, "getInterfaces") && type.getInterfaces().length > 0
        ? ` implements ${type
            .getInterfaces()
            .map((v) => getTypeName(v))
            .join(", ")}`
        : ""
    }`;
    code += ` {\n`;
    code += getFields(type)
      .map((v) => `  ${this.printCodeField(v)}`)
      .join("");
    code += `}`;

    return code;
  }

  printHeader(id, title) {
    return `---\nid: ${id}\ntitle: ${title}\n---\n`;
  }

  printDeprecation(type) {
    if (type.isDeprecated) {
      return `<span class="badge badge--warning">DEPRECATED${
        type.deprecationReason ? ": " + type.deprecationReason : ""
      }</span>\n\n`;
    }
    return "";
  }

  printDescription(type, noText = NO_DESCRIPTION_TEXT) {
    let description = "";

    description = `${this.printDeprecation(type)}${
      (hasProperty(type, "description") && type.description) || noText
    }`;

    return description;
  }

  printSpecification(type) {
    if (type.specifiedByUrl) {
      return `
export const specifiedByLinkCss = { fontSize:'1.5em', paddingLeft:'4px' };
${HEADER_SECTION_LEVEL} Specification<a className="link" style={specifiedByLinkCss} target="_blank" href="${type.specifiedByUrl}" title="Specified by ${type.specifiedByUrl}">⎘</a>\n\n
      `;
    }
    return "";
  }

  printCode(type) {
    let code = "\n```graphql\n";
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
    code += "```\n";
    return code;
  }

  printType(name, type) {
    if (!type) {
      return "";
    }

    const header = this.printHeader(name, getTypeName(type));
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

    return prettifyMarkdown(
      `${header}\n\n${description}\n\n${code}\n\n${metadata}\n\n`,
    );
  }
};
