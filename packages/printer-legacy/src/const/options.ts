import { GraphQLSchema } from "graphql";
import { TypeDeprecatedOption, DeprecatedOption } from "core/src/config";

import {
  HEADER_SECTION_ITEM_LEVEL,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
} from "./strings";
import { DirectiveName, SchemaEntitiesGroupMap } from "@graphql-markdown/utils";

export { TypeDeprecatedOption, DeprecatedOption } from "core/src/config";

export enum SectionLevel {
  NONE = "",
  LEVEL_3 = HEADER_SECTION_LEVEL,
  LEVEL_4 = HEADER_SECTION_SUB_LEVEL,
  LEVEL_5 = HEADER_SECTION_ITEM_LEVEL,
}

export type ConfigPrintTypeOptions = {
  codeSection?: boolean
  deprecated?: TypeDeprecatedOption,
  parentTypePrefix?: boolean
  relatedTypeSection?: boolean
  typeBadges?: boolean
}

export type Options = {
  basePath: string, 
  codeSection: boolean,
  collapsible?: { dataOpen: string, dataClose: string },
  customDirectives?: Record<string, any>,
  deprecated: TypeDeprecatedOption,
  groups?: SchemaEntitiesGroupMap,
  level?: SectionLevel, 
  parentType?: string, 
  parentTypePrefix: boolean,
  relatedTypeSection: boolean,
  schema?: GraphQLSchema,
  skipDocDirective?: DirectiveName[],
  typeBadges: boolean, 
  withAttributes: boolean, 
  header?: { toc: boolean, pagination: boolean }
}

export const PRINT_TYPE_DEFAULT_OPTIONS: Required<ConfigPrintTypeOptions> = {
  parentTypePrefix: true,
  deprecated: DeprecatedOption.DEFAULT,
  codeSection: true,
  relatedTypeSection: true,
  typeBadges: true
};

export const DEFAULT_OPTIONS: Required<Omit<Options, "schema" | "skipDocDirective">> & {schema?: GraphQLSchema, skipDocDirective?: DirectiveName[]}= {
  ...PRINT_TYPE_DEFAULT_OPTIONS,
  basePath: "/",
  customDirectives: {},
  groups: {},
  schema: undefined,
  skipDocDirective: undefined,
  withAttributes: false,
  header: { toc: true, pagination: true }
};
