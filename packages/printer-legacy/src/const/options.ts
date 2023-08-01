import {
  CustomDirectiveMap,
  DirectiveName,
  SchemaEntitiesGroupMap,
  GraphQLSchema,
} from "@graphql-markdown/utils";

import { TypeDeprecatedOption, DeprecatedOption } from "core/src/config";
export { TypeDeprecatedOption, DeprecatedOption } from "core/src/config";

import {
  HEADER_SECTION_ITEM_LEVEL,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
} from "./strings";

export type RootTypeName =
  | "DIRECTIVE"
  | "ENUM"
  | "INPUT"
  | "INTERFACE"
  | "MUTATION"
  | "OPERATION"
  | "QUERY"
  | "SCALAR"
  | "SUBSCRIPTION"
  | "TYPE"
  | "UNION";
export type TypeLocale = { singular: string; plural: string } | string;
export type RootTypeLocale = {
  [name in RootTypeName]: TypeLocale;
};

export enum SectionLevel {
  NONE = "",
  LEVEL_3 = HEADER_SECTION_LEVEL,
  LEVEL_4 = HEADER_SECTION_SUB_LEVEL,
  LEVEL_5 = HEADER_SECTION_ITEM_LEVEL,
}

export type ConfigPrintTypeOptions = {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
};

export type CollapsibleOption = { dataOpen: string; dataClose: string };

export type Options = {
  basePath: string;
  codeSection?: boolean;
  collapsible?: CollapsibleOption;
  customDirectives?: CustomDirectiveMap;
  deprecated?: TypeDeprecatedOption;
  groups?: SchemaEntitiesGroupMap;
  level?: SectionLevel | string;
  parentType?: string;
  parentTypePrefix: boolean;
  relatedTypeSection?: boolean;
  schema?: GraphQLSchema;
  skipDocDirective?: DirectiveName[];
  typeBadges?: boolean;
  withAttributes?: boolean;
  header?: { toc?: boolean; pagination?: boolean };
};

export const PRINT_TYPE_DEFAULT_OPTIONS: Required<ConfigPrintTypeOptions> = {
  codeSection: true,
  deprecated: DeprecatedOption.DEFAULT,
  parentTypePrefix: true,
  relatedTypeSection: true,
  typeBadges: true,
};

export const DEFAULT_OPTIONS: Required<
  Omit<Options, "schema" | "skipDocDirective" | "collapsible" | "parentType">
> & {
  schema?: GraphQLSchema;
  skipDocDirective?: DirectiveName[];
  collapsible?: CollapsibleOption;
  parentType?: string;
} = {
  ...PRINT_TYPE_DEFAULT_OPTIONS,
  basePath: "/",
  collapsible: undefined,
  customDirectives: {},
  groups: {},
  header: { toc: true, pagination: true },
  level: SectionLevel.LEVEL_3,
  parentType: undefined,
  schema: undefined,
  skipDocDirective: undefined,
  withAttributes: false,
};
