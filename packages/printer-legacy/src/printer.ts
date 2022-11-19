import { Maybe } from "graphql/jsutils/Maybe";

import { IPrinter } from "@graphql-markdown/core/type";
import { toSlug, escapeMDX } from "@graphql-markdown/utils/string";
import { pathUrl } from "@graphql-markdown/utils/url";
import {
  isParametrizedField,
  isOperation,
  getDefaultValue,
  getTypeName,
  getFields,
  getRelationOfReturn,
  getRelationOfField,
  getRelationOfImplementation,
  hasDirective,
  RelationOf,
  RelationTypeList,
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
import {
  GraphQLArgument,
  GraphQLDirective,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  getNamedType,
  isDirective,
  isEnumType,
  isInputType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
  GraphQLType,
} from "graphql/type";
import mdx from "./const/mdx";

type Link = {
  text: string;
  url: string;
};

type SectionLevel = {
  level?: Maybe<string>;
  parentType?: Maybe<string>;
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
      case isDirective(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["DIRECTIVE"];
      case isOperation(graphLQLNamedType):
        return ROOT_TYPE_LOCALE["OPERATION"];
    }
    return undefined;
  }

  getGroup(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument
  ): string {
    if (typeof this.groups === "undefined") {
      return "";
    }
    const graphLQLNamedType: GraphQLNamedType = getNamedType(
      type as GraphQLType
    );
    const typeName: string =
      graphLQLNamedType.name || graphLQLNamedType.toString();
    return typeName in this.groups ? toSlug(this.groups[typeName]) : "";
  }

  toLink(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument,
    name: string,
    operation?: TypeLocale
  ): Link {
    const fallback: Link = {
      text: name,
      url: "#",
    };

    if (hasDirective(type, this.skipDocDirective)) {
      return fallback;
    }

    const graphLQLNamedType: GraphQLNamedType = getNamedType(
      type as GraphQLType
    );

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

  getRelationLink(category: TypeLocale, type: Maybe<GraphQLNamedType>) {
    if (
      typeof category === "undefined" ||
      typeof type === "undefined" ||
      type === null
    ) {
      return "";
    }
    const link: Link = this.toLink(type, type.name, category);
    return `[\`${link.text}\`](${link.url})  <Badge class="secondary" text="${category.singular}"/>`;
  }

  printSection(
    values: GraphQLNamedType[] | GraphQLEnumValue[] | GraphQLArgument[],
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
      level: undefined,
    })}${MARKDOWN_EOP}`;
  }

  printSectionItems(
    values: GraphQLNamedType[] | GraphQLEnumValue[] | GraphQLArgument[],
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

  printLinkAttributes(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument,
    text: string
  ): string {
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
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument,
    withAttributes: boolean = false,
    parentType?: Maybe<string>
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

  getTypeBadges(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument
  ): string[] {
    const rootType = (
      "type" in type ? (type.type as GraphQLNamedType) : type
    ) as GraphQLNamedType;

    const badges: string[] = [];

    if ("deprecationReason" in type && type.deprecationReason) {
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

  printBadges(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument
  ): string {
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

  printParentLink(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument
  ): string {
    return "type" in type
      ? `<Bullet />${this.printLink(type.type as GraphQLNamedType, true)}`
      : "";
  }

  printSectionItem(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument,
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
      section += this.printSectionItems(
        (type as any).args as unknown as GraphQLNamedType[],
        {
          level: HEADER_SECTION_ITEM_LEVEL,
          parentType:
            typeof parentType === "undefined"
              ? undefined
              : `${parentType}.${type.name}`,
        }
      );
    }

    return section;
  }

  printCodeEnum(type: unknown): string {
    if (!isEnumType(type)) {
      return "";
    }

    let code: string = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
    code += type
      .getValues()
      .map((v: any) => `  ${getTypeName(v)}`)
      .join(MARKDOWN_EOL);
    code += `${MARKDOWN_EOL}}`;

    return code;
  }

  printCodeUnion(type: unknown): string {
    if (!isUnionType(type)) {
      return "";
    }

    let code: string = `union ${getTypeName(type)} = `;
    code += type
      .getTypes()
      .map((v: GraphQLNamedType) => getTypeName(v))
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
    code += type.args.reduce((r: string, v: GraphQLInputField) => {
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

  printCodeField(
    type:
      | GraphQLField<unknown, unknown, unknown>
      | GraphQLInputField
      | GraphQLObjectType<unknown, unknown>
  ): string {
    let code: string = `${getTypeName(type)}`;
    code += this.printCodeArguments(type);
    code += `: ${getTypeName(
      (type as any).type as GraphQLNamedType
    )}${MARKDOWN_EOL}`;

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

  printCodeType(
    type:
      | GraphQLNamedType
      | GraphQLDirective
      | GraphQLInterfaceType
      | GraphQLObjectType<any, any>
      | GraphQLInputType
  ) {
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
            .map((field: GraphQLInterfaceType) => getTypeName(field))
            .join(", ")}`
        : "";
    const typeFields: string = getFields(type as GraphQLNamedType)
      .map(
        (
          v: Maybe<GraphQLField<unknown, unknown, unknown> | GraphQLInputField>
        ) => (v ? `  ${this.printCodeField(v)}` : "")
      )
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

  printDeprecation(
    type: unknown
  ): string {
    if (!("isDeprecated" in (type as any)) || !(type as any).isDeprecated) {
      return "";
    }

    const reason =
      typeof (type as any).deprecationReason !== "string"
        ? ""
        : ": " + escapeMDX((type as any).deprecationReason);
    return `<Badge class="warning" text="DEPRECATED${reason}"/>${MARKDOWN_EOP}`;
  }

  printDescription(
    type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument,
    noText: string = NO_DESCRIPTION_TEXT
  ): string {
    const description = ("description" in type &&
      escapeMDX(type.description)) as string;
    return `${this.printDeprecation(type)}${description || noText}`;
  }

  printSpecification(type: GraphQLNamedType): string {
    if (!("specifiedByURL" in type)) {
      return "";
    }

    const url = ("specifiedByURL" in type && type.specifiedByURL) as string;

    // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
    return `${HEADER_SECTION_LEVEL} <SpecifiedBy url="${url}"/>${MARKDOWN_EOP}`;
  }

  printCode(type: unknown) {
    let code: string = `${MARKDOWN_EOL}\`\`\`graphql${MARKDOWN_EOL}`;

    if (isOperation(type)) {
      code += this.printCodeField(type as any);
    } else if (isEnumType(type)) {
      code += this.printCodeEnum(type);
    } else if (isUnionType(type)) {
      code += this.printCodeUnion(type);
    } else if (isScalarType(type)) {
      code += this.printCodeScalar(type);
    } else if (
      isInterfaceType(type) ||
      isObjectType(type) ||
      isInputType(type)
    ) {
      code += this.printCodeType(type);
    } else if (isDirective(type)) {
      code += this.printCodeDirective(type);
    } else {
      code += `"${type}" not supported`;
    }
    return code.trim() + `${MARKDOWN_EOL}\`\`\`${MARKDOWN_EOL}`;
  }

  printTypeMetadata(type: unknown): string {
    let metadata: string = "";

    if (isScalarType(type)) {
      return this.printSpecification(type);
    }
    if (isEnumType(type)) {
      return this.printSection(
        type.getValues() as unknown as GraphQLEnumValue[],
        "Values",
        {
          parentType: type.name,
          level: undefined,
        }
      );
    }
    if (isUnionType(type)) {
      return this.printSection(
        type.getTypes() as unknown as GraphQLObjectType<any, any>[],
        "Possible types",
        {}
      );
    }
    if (isObjectType(type) || isInterfaceType(type) || isInputType(type)) {
      metadata = this.printSection(
        getFields(type) as GraphQLInputField[],
        "Fields",
        {
          parentType: "name" in type ? type.name : undefined,
        }
      );
      if ("getInterfaces" in type) {
        metadata += this.printSection(
          type.getInterfaces() as unknown as GraphQLInterfaceType[],
          "Interfaces",
          {}
        );
      }
      return metadata;
    }
    if (isDirective(type)) {
      metadata = this.printSection(
        type.args as unknown as GraphQLArgument[],
        "Arguments",
        {
          parentType: type.name,
        }
      );
      return metadata;
    }
    if (isOperation(type)) {
      if ("args" in <any>type) {
        metadata = this.printSection(
          (type as any).args as unknown as GraphQLNamedType[],
          "Arguments",
          {
            parentType:
              "name" in <any>type ? ((type as any).name as string) : undefined,
          }
        );
      }
      const queryType = getTypeName(
        (type as any).type as GraphQLNamedType
      ).replace(/[![\]]*/g, "");
      metadata += this.printSection(
        [this.schema.getType(queryType) as GraphQLNamedType],
        "Type",
        {}
      );

      return metadata;
    }

    return metadata;
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
    for (const [relation, types] of Object.entries(relations) as [
      string,
      RelationTypeList
    ][]) {
      if (types.length === 0) {
        continue;
      }

      const category = this.getRootTypeLocaleFromString(relation) as TypeLocale;
      data = data.concat(
        types.map((t: Maybe<GraphQLNamedType>) =>
          this.getRelationLink(category, t)
        )
      );
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

export default Printer;
