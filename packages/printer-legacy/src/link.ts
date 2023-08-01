import {
  getNamedType,
  getTypeName,
  hasDirective,
  isDeprecated,
  isDirectiveType,
  isEnumType,
  isInputType,
  isInterfaceType,
  isLeafType,
  isListType,
  isNonNullType,
  isObjectType,
  isOperation,
  isScalarType,
  isUnionType,
  toSlug,
  pathUrl,
  SchemaEntity,
  GraphQLType,
  GraphQLNamedType,
} from "@graphql-markdown/utils";

import { getGroup } from "./group";
import { DEPRECATED, ROOT_TYPE_LOCALE } from "./const/strings";
import { Options, DeprecatedOption, TypeLocale } from "./const/options";
import { MDXString } from "./const/mdx";

export type TypeLink = {
  text: string;
  url: string;
};

export type PrintLinkOptions = Pick<
  Options,
  | "groups"
  | "parentTypePrefix"
  | "parentType"
  | "basePath"
  | "withAttributes"
  | "skipDocDirective"
  | "deprecated"
> &
  Partial<Options>;

export class Link {
  static getLinkCategory = (type: unknown): TypeLocale | undefined => {
    switch (true) {
      case isDirectiveType(type):
        return ROOT_TYPE_LOCALE.DIRECTIVE;
      case isEnumType(type):
        return ROOT_TYPE_LOCALE.ENUM;
      case isInputType(type):
        return ROOT_TYPE_LOCALE.INPUT;
      case isInterfaceType(type):
        return ROOT_TYPE_LOCALE.INTERFACE;
      case isObjectType(type):
        return ROOT_TYPE_LOCALE.TYPE;
      case isOperation(type):
        return ROOT_TYPE_LOCALE.OPERATION;
      case isScalarType(type):
        return ROOT_TYPE_LOCALE.SCALAR;
      case isUnionType(type):
        return ROOT_TYPE_LOCALE.UNION;
    }
    return undefined;
  };

  static toLink = (
    type: unknown,
    name: string,
    operation: TypeLocale | undefined,
    options: PrintLinkOptions,
  ): TypeLink => {
    const fallback: TypeLink = {
      text: name,
      url: "#",
    };

    if (typeof type !== "object") {
      return fallback;
    }

    if (typeof options !== "undefined" && "skipDocDirective" in options) {
      if (hasDirective(type, options.skipDocDirective)) {
        return fallback;
      }
    }

    const graphLQLNamedType = getNamedType(type as GraphQLType);

    let category = Link.getLinkCategory(graphLQLNamedType);

    if (
      typeof category === "undefined" ||
      typeof graphLQLNamedType === "undefined" ||
      graphLQLNamedType === null
    ) {
      return fallback;
    }

    // special case for relation map
    if (category === ROOT_TYPE_LOCALE.OPERATION) {
      if (typeof operation === "undefined") {
        return fallback;
      }
      category = operation;
    }

    if (typeof category === "object") {
      category = category.plural;
    }

    const text = graphLQLNamedType.name || graphLQLNamedType.toString();
    const deprecated =
      typeof options !== "undefined" &&
      "deprecated" in options &&
      options.deprecated === DeprecatedOption.GROUP &&
      isDeprecated(type)
        ? DEPRECATED
        : "";
    const group =
      typeof options !== "undefined" &&
      "groups" in options &&
      typeof options.groups !== "undefined"
        ? getGroup(type, options.groups, category as SchemaEntity)
        : "";
    const url = pathUrl.join(
      options.basePath!,
      deprecated,
      group,
      category,
      toSlug(text),
    );

    return {
      text: text,
      url: url,
    } as TypeLink;
  };

  static getRelationLink = (
    category: TypeLocale | undefined,
    type: unknown,
    options: PrintLinkOptions,
  ): TypeLink | undefined => {
    if (
      typeof category === "undefined" ||
      typeof type !== "object" ||
      type === null ||
      !("name" in type)
    ) {
      return undefined;
    }
    return Link.toLink(type, type.name as string, category, options);
  };

  static printParentLink = (
    type: unknown,
    options: PrintLinkOptions,
  ): string | MDXString => {
    if (typeof type !== "object" || type === null || !("type" in type)) {
      return "";
    }

    return `<Bullet />${Link.printLink(type.type, {
      ...options,
      withAttributes: true,
    })}` as MDXString;
  };

  static hasOptionWithAttributes = (options: PrintLinkOptions): boolean =>
    options !== null &&
    "withAttributes" in options &&
    options.withAttributes === true;

  static hasOptionParentType = (options: PrintLinkOptions): boolean =>
    "parentTypePrefix" in options &&
    options.parentTypePrefix === true &&
    "parentType" in options &&
    typeof options.parentType !== "undefined";

  static printLink = (type: unknown, options: PrintLinkOptions) => {
    if (typeof type !== "object" || type === null) {
      return "";
    }

    const link = Link.toLink(
      type,
      getTypeName(type, type.toString()),
      undefined,
      options,
    );

    if (
      typeof options !== "undefined" &&
      Link.hasOptionWithAttributes(options) === false
    ) {
      const textWithAttribute =
        Link.hasOptionParentType(options) === true
          ? `<code style={{ fontWeight: 'normal' }}>${options.parentType}.<b>${link.text}</b></code>`
          : `\`${link.text}\``;
      return `[${textWithAttribute}](${link.url})`;
    }

    const text = Link.printLinkAttributes(type, link.text);

    return `[\`${text}\`](${link.url})`;
  };

  static printLinkAttributes = (type: unknown, text: string = ""): string => {
    if (typeof type !== "object" || type === null) {
      return text ?? "";
    }

    if (
      !isLeafType(type) &&
      "ofType" in type &&
      typeof type.ofType != "undefined"
    ) {
      text = Link.printLinkAttributes(type.ofType as GraphQLNamedType, text);
    }

    if (isListType(type)) {
      return `[${text}]`;
    }

    if (isNonNullType(type)) {
      return `${text}!`;
    }

    return text;
  };
}
