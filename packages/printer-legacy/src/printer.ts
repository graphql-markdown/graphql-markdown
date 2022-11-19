import { Maybe } from "graphql/jsutils/Maybe";

import { IPrinter } from "@graphql-markdown/core/type";
import { toSlug, escapeMDX } from "@graphql-markdown/utils/string";
import { pathUrl } from "@graphql-markdown/utils/url";
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
  isNonNullType,
  getRelationOfReturn,
  getRelationOfField,
  getRelationOfImplementation,
  hasDirective,
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLScalarType,
  RelationOf,
  RelationTypeList,
  GraphQLDirective,
} from "@graphql-markdown/utils/graphql";

import {
  ROOT_TYPE_LOCALE,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
  NO_DESCRIPTION_TEXT,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  TypeLocale,
} from "./const/strings";
import mdx from "./const/mdx";

type Link = {
  text: string;
  url: string;
};

type SectionLevel = {
  level?: string;
  parentType?: string;
};

export class Printer implements IPrinter {
  schema: GraphQLSchema;
  baseURL: string;
  linkRoot: string;
  groups: any;
  parentTypePrefix: boolean;
  relatedTypeSection: boolean;
  typeBadges: boolean;
  skipDocDirective: any;

  constructor(
    schema: GraphQLSchema,
    baseURL: string,
    linkRoot = "/",
    {
      groups,
      printTypeOptions,
      skipDocDirective,
    }: {
      groups?: any;
      printTypeOptions?: any;
      skipDocDirective?: any;
    }
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

  getRootTypeLocaleFromString(text: string): Maybe<TypeLocale> {
    for (const [type, props] of Object.entries(ROOT_TYPE_LOCALE)) {
      if (Object.values(props).includes(text)) {
        return ROOT_TYPE_LOCALE[type];
      }
    }
    return undefined;
  }

  getLinkCategory(graphLQLNamedType: GraphQLNamedType): Maybe<TypeLocale> {
    switch (true) {
      case isEnumType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["ENUM"];
      case isUnionType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["UNION"];
      case isInterfaceType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["INTERFACE"];
      case isObjectType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["TYPE"];
      case isInputType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["INPUT"];
      case isScalarType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["SCALAR"];
      case isDirectiveType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["DIRECTIVE"];
      case isOperation(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["OPERATION"];
    }
    return undefined;
  }

  getGroup(type: GraphQLNamedType): string {
    if (typeof this.groups === "undefined") {
      return "";
    }
    const graphLQLNamedType: GraphQLNamedType = getNamedType(type);
    const typeName: string =
      graphLQLNamedType.name || graphLQLNamedType.toString();
    return typeName in this.groups ? toSlug(this.groups[typeName]) : "";
  }

  toLink(type: GraphQLNamedType, name: string, operation?: TypeLocale): Link {
    const fallback: Link = {
      text: name,
      url: "#",
    };

    if (hasDirective(type, this.skipDocDirective)) {
      return fallback;
    }

    const graphLQLNamedType: GraphQLNamedType = getNamedType(type);

    let category: Maybe<TypeLocale> = this.getLinkCategory(graphLQLNamedType);

    if (
      typeof category === "undefined" ||
      category === null ||
      typeof graphLQLNamedType === "undefined" ||
      graphLQLNamedType === null
    ) {
      return fallback;
    }

    // special case for support relation map
    if (category === ROOT_TYPE_LOCALE["OPERATION"]) {
      if (typeof operation === "undefined") {
        return fallback;
      }
      category = operation;
    }

    const text: string = graphLQLNamedType.name || graphLQLNamedType.toString();
    const group: string = this.getGroup(type);
    const url: string = pathUrl.join(
      this.linkRoot,
      this.baseURL,
      group,
      category.plural,
      toSlug(text)
    );

    return {
      text: text,
      url: url,
    } as Link;
  }

  getRelationLink(category: TypeLocale, type: GraphQLNamedType) {
    if (typeof category === "undefined") {
      return "";
    }
    const link: Link = this.toLink(type, type.name, category);
    return `[\`${link.text}\`](${link.url})  <Badge class="secondary" text="${category.singular}"/>`;
  }

  printSection(
    values: GraphQLNamedType[],
    section: string,
    { level, parentType }: SectionLevel
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
    values: GraphQLNamedType[],
    { level, parentType }: SectionLevel
  ): string {
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

  printLinkAttributes(type: GraphQLNamedType, text: string): string {
    if (typeof type === "undefined") {
      return text ?? "";
    }

    if (isListType(type)) {
      return `[${text}]`;
    }

    if (isNonNullType(type)) {
      return `${text}!`;
    }

    return text;
  }

  printLink(
    type: GraphQLNamedType,
    withAttributes: boolean = false,
    parentType?: string
  ): string {
    const link: Link = this.toLink(type, getTypeName(type));

    if (!withAttributes) {
      const printParentType: boolean =
        this.parentTypePrefix && typeof parentType !== "undefined";
      const text: string = printParentType
        ? `<code style={{ fontWeight: 'normal' }}>${parentType}.<b>${link.text}</b></code>`
        : `\`${link.text}\``;
      return `[${text}](${link.url})`;
    }

    const text: string = this.printLinkAttributes(type, link.text);

    return `[\`${text}\`](${link.url})`;
  }

  getTypeBadges(type): string[] {
    const rootType: GraphQLNamedType = "type" in type ? type.type : type;

    const badges: string[] = [];

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
    if (typeof category !== "undefined" && category !== null) {
      badges.push(category.singular);
    }

    const group = this.getGroup(rootType);
    if (group !== "") {
      badges.push(group);
    }

    return badges;
  }

  printBadges(type: GraphQLNamedType): string {
    if (typeof this.typeBadges === "undefined") {
      return "";
    }

    const badges: string[] = this.getTypeBadges(type);

    if (badges.length === 0) {
      return "";
    }

    return badges
      .map((badge) => `<Badge class="secondary" text="${badge}"/>`)
      .join(" ");
  }

  printParentLink(type: GraphQLNamedType): string {
    return "type" in type ? `<Bullet />${this.printLink(type.type, true)}` : "";
  }

  printSectionItem(
    type: GraphQLNamedType,
    { level, parentType }: SectionLevel
  ): string {
    if (typeof level === "undefined") {
      level = HEADER_SECTION_SUB_LEVEL;
    }

    const typeNameLink: string = this.printLink(type, false, parentType);
    const description: string = this.printDescription(type, "");
    const badges: string = this.printBadges(type);
    const parentTypeLink: String = this.printParentLink(type);

    let section: string = `${level} ${typeNameLink}${parentTypeLink} ${badges}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
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

  printCodeEnum(type: GraphQLEnumType): string {
    let code: string = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
    code += type
      .getValues()
      .map((v: any) => `  ${getTypeName(v)}`)
      .join(MARKDOWN_EOL);
    code += `${MARKDOWN_EOL}}`;

    return code;
  }

  printCodeUnion(type: GraphQLUnionType): string {
    let code: string = `union ${getTypeName(type)} = `;
    code += type
      .getTypes()
      .map((v) => getTypeName(v))
      .join(" | ");

    return code;
  }

  printCodeScalar(type: GraphQLScalarType): string {
    return `scalar ${getTypeName(type)}`;
  }

  printCodeArguments(type: any): string {
    if (!("args" in type) || type.args.length === 0) {
      return "";
    }

    let code: string = `(${MARKDOWN_EOL}`;
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

  printCodeField(type: GraphQLNamedType): string {
    let code: string = `${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    code += `: ${getTypeName(type.type)}${MARKDOWN_EOL}`;

    return code;
  }

  printCodeDirectiveLocation(type: GraphQLDirective): string {
    if (
      typeof type.locations === "undefined" ||
      type.locations == null ||
      type.locations.length === 0
    ) {
      return "";
    }

    let code: string = ` on `;
    const separator: string = `\r\n  | `;
    if (type.locations.length > 1) {
      code += separator;
    }
    code += type.locations.join(separator).trim();

    return code;
  }

  printCodeDirective(type: GraphQLDirective): string {
    let code: string = `directive @${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    code += this.printCodeDirectiveLocation(type);

    return code;
  }

  printCodeType(type: GraphQLNamedType | GraphQLDirective) {
    let entity: string;

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

    const name: string = getTypeName(type);
    const extendsInterface: string =
      (isObjectType(type) || isInterfaceType(type)) &&
      type.getInterfaces().length > 0
        ? ` implements ${type
            .getInterfaces()
            .map((field) => getTypeName(field))
            .join(", ")}`
        : "";
    const typeFields: string = getFields(type)
      .map((v: any[]) => `  ${this.printCodeField(v)}`)
      .join("");

    return `${entity} ${name}${extendsInterface} {${MARKDOWN_EOL}${typeFields}}`;
  }

  printHeader(id: string, title: string, options: any) {
    const { toc, pagination }: { toc: boolean; pagination: boolean } = {
      toc: true,
      pagination: true,
      ...options,
    };
    const pagination_buttons: string = pagination
      ? ""
      : `pagination_next: null${MARKDOWN_EOL}pagination_prev: null${MARKDOWN_EOL}`;
    return `---${MARKDOWN_EOL}id: ${id}${MARKDOWN_EOL}title: ${title}\nhide_table_of_contents: ${!toc}${MARKDOWN_EOL}${pagination_buttons}---${MARKDOWN_EOL}`;
  }

  printDeprecation(type: GraphQLNamedType): string {
    if (!("isDeprecated" in type) || !type.isDeprecated) {
      return "";
    }

    const reason =
      "deprecationReason" in type &&
      typeof type.deprecationReason !== "undefined"
        ? ": " + escapeMDX(type.deprecationReason)
        : "";
    return `<Badge class="warning" text="DEPRECATED${reason}"/>${MARKDOWN_EOP}`;
  }

  printDescription(
    type: GraphQLNamedType,
    noText: string = NO_DESCRIPTION_TEXT
  ): string {
    const description: string =
      "description" in type && escapeMDX(type.description);
    return `${this.printDeprecation(type)}${description || noText}`;
  }

  printSpecification(type: GraphQLNamedType): string {
    if (!("specifiedByURL" in type) && !("specifiedByUrl" in type)) {
      return "";
    }

    const url: string = type.specifiedByURL || type.specifiedByUrl;

    // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
    return `${HEADER_SECTION_LEVEL} <SpecifiedBy url="${url}"/>${MARKDOWN_EOP}`;
  }

  printCode(type: GraphQLNamedType | GraphQLDirective) {
    let code: string = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;

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

  printTypeMetadata(type: GraphQLNamedType | GraphQLDirective): string {
    let metadata: string = "";

    switch (true) {
      case isScalarType(type):
        return this.printSpecification(type);
      case isEnumType(type):
        return this.printSection(type.getValues(), "Values", {
          parentType: type.name,
        });
      case isUnionType(type):
        return this.printSection(type.getTypes(), "Possible types", {});
      case isObjectType(type):
      case isInterfaceType(type):
      case isInputType(type): {
        metadata = this.printSection(getFields(type), "Fields", {
          parentType: type.name,
        });
        if ("getInterfaces" in type) {
          metadata += this.printSection(type.getInterfaces(), "Interfaces", {});
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
        metadata += this.printSection(
          [this.schema.getType(queryType)],
          "Type",
          {}
        );

        return metadata;
      }
      default:
        return metadata;
    }
  }

  printRelations(type: GraphQLNamedType): string {
    const relations: Record<string, Function> = {
      "Returned by": getRelationOfReturn,
      "Member of": getRelationOfField,
      "Implemented by": getRelationOfImplementation,
    };

    let data: string = "";
    for (const [section, getRelation] of Object.entries(relations)) {
      data += this.printRelationOf(type, section, getRelation);
    }

    return data;
  }

  printRelationOf(
    type: GraphQLNamedType,
    section: string,
    getRelation: Function
  ): string {
    if (
      typeof type === "undefined" ||
      typeof getRelation !== "function" ||
      isOperation(type)
    ) {
      return "";
    }

    const relations: Partial<RelationOf> = getRelation(type, this.schema);

    if (typeof relations === "undefined") {
      return "";
    }

    let data: string[] = [];
    for (const [relation, types] of Object.entries(
      relations
    ) as RelationTypeList) {
      if (types.length === 0) {
        continue;
      }

      const category = this.getRootTypeLocaleFromString(relation) as TypeLocale;
      data = data.concat(types.map((t) => this.getRelationLink(category, t)));
    }

    if (data.length === 0) {
      return "";
    }

    const content = [...data]
      .sort((a: string, b: string) => a.localeCompare(b))
      .join("<Bullet />");

    return `${HEADER_SECTION_LEVEL} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
  }

  printType(name: string, type: GraphQLNamedType, options: any): string {
    if (typeof type === "undefined" || type === null) {
      return "";
    }

    const header: string = this.printHeader(name, getTypeName(type), options);
    const description: string = this.printDescription(type);
    const code: string = this.printCode(type);
    const metadata: string = this.printTypeMetadata(type);
    const relations: string = this.relatedTypeSection
      ? this.printRelations(type)
      : "";

    return `${header}${MARKDOWN_EOP}${mdx}${MARKDOWN_EOP}${description}${MARKDOWN_EOP}${code}${MARKDOWN_EOP}${metadata}${MARKDOWN_EOP}${relations}${MARKDOWN_EOP}`;
  }
}
