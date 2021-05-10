import * as path from "path";
import {
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
  toSlug,
  hasOwnProperty,
  hasOwnMethod,
  prettifyMarkdown,
} from ".";

const HEADER_SECTION_LEVEL = "###";
const HEADER_SECTION_SUB_LEVEL = "####";
const HEADER_SECTION_ITEM_LEVEL = "- #####";
const NO_DESCRIPTION_TEXT = "No description";

const TAG = `
export const Tag = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}>
    {children}
  </span>
);`;

export class Printer {
  schema: any;
  baseURL: any;
  linkRoot: string;
  constructor(schema: any, baseURL: any, linkRoot = "/") {
    this.schema = schema;
    this.baseURL = baseURL;
    this.linkRoot = linkRoot;
  }

  toLink(type: any, name: any) {
    let graphLQLNamedType: any = getNamedType(type);
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

  printSection(values: any[], section: string, level = HEADER_SECTION_LEVEL) {
    if (values.length > 0)
      return `${level} ${section}\n\n${this.printSectionItems(values)}\n\n`;
    return "";
  }

  printSectionItems(values: any[], level = HEADER_SECTION_SUB_LEVEL) {
    if (Array.isArray(values))
      return values
        .map((v) => v && this.printSectionItem(v, level))
        .join(`\n\n`);
    return "";
  }

  printSectionItem(type: any, level = HEADER_SECTION_SUB_LEVEL) {
    if (!type) {
      return "";
    }

    let section = `${level} ${this.toLink(type, getTypeName(type))} ${
      hasOwnProperty(type, "type")
        ? `(${this.toLink(type.type, getTypeName(type.type))})`
        : ""
    }\n\n${this.printDescription(type, "")}\n`;
    if (isParametrizedField(type)) {
      section += this.printSectionItems(type.args, HEADER_SECTION_ITEM_LEVEL);
    }
    return section;
  }

  printCodeEnum(type: { getValues?: any; name?: any; toString?: () => any }) {
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

  printCodeUnion(type: { getTypes?: any; name?: any; toString?: () => any }) {
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

  printCodeScalar(type: { name: any; toString: () => any }) {
    return `scalar ${getTypeName(type)}`;
  }

  printCodeArguments(type: { [x: string]: any; args?: any }) {
    let code = "";
    if (hasOwnProperty(type, "args") && type.args.length > 0) {
      code += `(\n`;
      code += type.args.reduce(
        (r: any, v: any ) => {
          const defaultValue = getDefaultValue(v);
          return `${r}  ${v.name}: ${v.type.toString()}${
            defaultValue ? ` = ${defaultValue}` : ""
          }\n`;
        },
        "",
      );
      code += `)`;
    }
    return code;
  }

  printCodeField(type: any) {
    let code = `${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    code += `: ${getTypeName(type.type)}\n`;
    return code;
  }

  printCodeDirective(type: { name: any; toString: () => any }) {
    let code = `directive @${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    return code;
  }

  printCodeType(type: any) {
    let code = `${isInterfaceType(type) ? "interface" : "type"} ${getTypeName(
      type,
    )}`;
    code += `${
      hasOwnMethod(type, "getInterfaces") && type.getInterfaces().length > 0
        ? ` implements ${type
            .getInterfaces()
            .map((v: { name: any; toString: () => any }) => getTypeName(v))
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

  printHeader(id: any, title: any) {
    return `---\nid: ${id}\ntitle: ${title}\n---\n`;
  }

  printDeprecation(type: { isDeprecated: any; deprecationReason: any }) {
    if (type.isDeprecated) {
      return `<sub><sup><Tag color="#ffba00">DEPRECATED</Tag> ${type.deprecationReason}</sup></sub>\n\n`;
    }
    return "";
  }

  printDescription(type: any, noText = NO_DESCRIPTION_TEXT) {
    let description = "";

    description = `${this.printDeprecation(type)}${
      (hasOwnProperty(type, "description") && type.description) || noText
    }`;

    return description;
  }

  printCode(type: { name: any; toString: () => any }) {
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
    code += "\n```\n";
    return code;
  }

  printType(name: any, type: any) {
    if (!type) {
      return "";
    }

    const header = this.printHeader(name, getTypeName(type));
    const description = this.printDescription(type);
    const code = this.printCode(type);

    let metadata = "";
    if (isEnumType(type)) {
      metadata = this.printSection(type.getValues(), "Values");
    }

    if (isUnionType(type)) {
      metadata = this.printSection(type.getTypes(), "Possible types");
    }

    if (isObjectType(type) || isInterfaceType(type) || isInputType(type)) {
      metadata = this.printSection(getFields(type), "Fields");
    }

    if (
      (isObjectType(type) || isInterfaceType(type)) &&
      hasOwnMethod(type, "getInterfaces")
    ) {
      metadata += this.printSection(type.getInterfaces(), "Interfaces");
    }

    if (isOperation(type)) {
      metadata = this.printSection(type.args, "Arguments");
      const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
      metadata += this.printSection([this.schema.getType(queryType)], "Type");
    }

    if (isDirectiveType(type)) {
      metadata = this.printSection(type.args, "Arguments");
    }

    return prettifyMarkdown(
      `${header}\n\n${TAG}\n\n${description}\n\n${code}\n\n${metadata}\n\n`,
    );
  }
}
