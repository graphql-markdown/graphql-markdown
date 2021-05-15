import { GraphQLArgument, GraphQLEnumValue, GraphQLField, GraphQLSchema, GraphQLType } from "graphql";
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
  isParametrized,
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
  constructor(readonly schema: GraphQLSchema, readonly baseURL: string, readonly linkRoot = "/") {
  }

  toLink(type: any, name: string): string {
    let graphLQLNamedType: GraphQLType = getNamedType(<GraphQLType>type);
    if (isListType(type)) graphLQLNamedType = getNamedType(<GraphQLType>type.ofType);
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
        toSlug(graphLQLNamedType.toString()),
      )})`;
    } else {
      return `\`${name}\``;
    }
  }

  printSection(values: GraphQLType[] | GraphQLEnumValue[] | GraphQLArgument[], section: string, level = HEADER_SECTION_LEVEL): string {
    if (values.length > 0)
      return `${level} ${section}\n\n${this.printSectionItems(values)}\n\n`;
    return "";
  }

  printSectionItems(values: GraphQLType[] | GraphQLArgument[] | GraphQLEnumValue[], level = HEADER_SECTION_SUB_LEVEL): string {
    if (Array.isArray(values))
      return values
        .map((v: GraphQLType | GraphQLArgument | GraphQLEnumValue) => v && this.printSectionItem(v, level))
        .join(`\n\n`);
    return "";
  }

  printSectionItem(type: GraphQLType | GraphQLArgument | GraphQLEnumValue, level = HEADER_SECTION_SUB_LEVEL): string {
    if (!type) {
      return "";
    }

    let section = `${level} ${this.toLink(type, getTypeName(type))} ${
      hasOwnProperty(type, "type")
        ? `(${this.toLink(<GraphQLType>type.type, getTypeName(<GraphQLType>type.type))})`
        : ""
    }\n\n${this.printDescription(type, "")}\n`;
    if (isParametrized(type)) {
      section += this.printSectionItems(type.args, HEADER_SECTION_ITEM_LEVEL);
    }
    return section;
  }

  printCodeEnum(type: GraphQLType): string {
    let code = "";
    if (isEnumType(type)) {
      code += `enum ${getTypeName(type)} {\n`;
      code += type
        .getValues()
        .map((value) => `  ${getTypeName(value)}`)
        .join("\n");
      code += `\n}`;
    }
    return code;
  }

  printCodeUnion(type: GraphQLType): string {
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

  printCodeScalar(type: GraphQLType): string {
    return `scalar ${getTypeName(type)}`;
  }

  printCodeArguments(type: any): string {
    let code = "";
    if (isParametrized(type)) {
      code += `(\n`;
      code += type.args.reduce(
        (r: never, v: GraphQLArgument ) => {
          const defaultValue = getDefaultValue(v);
          return `${r}  ${getTypeName(<GraphQLType><unknown>v)}: ${v.type.toString() ?? ""}${
            defaultValue ? ` = ${defaultValue}` : ""
          }\n`;
        },
        "",
      );
      code += `)`;
    }
    return code;
  }

  printCodeField<TSource, TContext, TArgs>(type: GraphQLField<TSource, TContext, TArgs>): string {
    let code = `${getTypeName(<GraphQLType><unknown>type)}`;
    code += this.printCodeArguments(type);
    if (hasOwnProperty(type, "type")) code += `: ${getTypeName(<GraphQLType>type.type)}\n`;
    return code;
  }

  printCodeDirective(type: GraphQLType): string {
    let code = `directive @${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    return code;
  }

  printCodeType(type: GraphQLType): string {
    let code = `${isInterfaceType(type) ? "interface" : "type"} ${getTypeName(
      type,
    )}`;
    code += `${
      hasOwnMethod(type, "getInterfaces") && type.getInterfaces().length > 0
        ? ` implements ${type
            .getInterfaces()
            .map((v: GraphQLType) => getTypeName(v))
            .join(", ")}`
        : ""
    }`;
    code += ` {\n`;
    code += getFields(type)
      ?.map((v: any) => `  ${this.printCodeField(v)}`)
      ?.join("");
    code += `}`;

    return code;
  }

  printHeader(id: string, title: string): string {
    return `---\nid: ${id}\ntitle: ${title}\n---\n`;
  }

  printDeprecation(type: GraphQLType | GraphQLArgument | GraphQLEnumValue): string {
    if (hasOwnProperty(type, "isDeprecated") && type.isDeprecated) {
      const reason = hasOwnProperty(type, "deprecationReason") && ` ${type.deprecationReason}` || "";
      return `<sub><sup><Tag color="#ffba00">DEPRECATED</Tag>${reason}</sup></sub>\n\n`;
    }
    return "";
  }

  printDescription(type: GraphQLType | GraphQLArgument | GraphQLEnumValue, noText = NO_DESCRIPTION_TEXT): string {
    let description = "";

    description = `${this.printDeprecation(type)}${
      (hasOwnProperty(type, "description") && type.description) || noText
    }`;

    return description;
  }

  printCode(type: GraphQLType): string {
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
        code += this.printCodeField(<any>type);
        break;
      default:
        code += `"${getTypeName(type)}" not supported`;
    }
    code += "\n```\n";
    return code;
  }

  printType(name: string, type: GraphQLType): string {
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
      metadata = this.printSection(<GraphQLType[]>getFields(type), "Fields");
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
      metadata += this.printSection([<GraphQLType>this.schema.getType(queryType)], "Type");
    }

    if (isDirectiveType(type)) {
      metadata = this.printSection(type.args, "Arguments");
    }

    return prettifyMarkdown(
      `${header}\n\n${TAG}\n\n${description}\n\n${code}\n\n${metadata}\n\n`,
    );
  }
}
