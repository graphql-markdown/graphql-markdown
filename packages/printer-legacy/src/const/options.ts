import type {
  CollapsibleOption,
  DirectiveName,
  GraphQLSchema,
  Maybe,
  PrintTypeHeaderOptions,
  PrintTypeOptions,
  PrinterConfigPrintTypeOptions,
  SchemaEntitiesGroupMap,
  SectionLevelValue,
} from "@graphql-markdown/types";

export enum SectionLevels {
  NONE = "",
  LEVEL_3 = "###",
  LEVEL_4 = "####",
  LEVEL_5 = "#####",
}

export const PRINT_TYPE_DEFAULT_OPTIONS: Required<PrinterConfigPrintTypeOptions> =
  {
    codeSection: true,
    deprecated: "default",
    parentTypePrefix: true,
    relatedTypeSection: true,
    typeBadges: true,
  };

export const DEFAULT_OPTIONS: Required<
  Omit<
    PrintTypeOptions,
    | "schema"
    | "skipDocDirective"
    | "collapsible"
    | "parentType"
    | "groups"
    | "level"
  >
> & {
  schema: Maybe<GraphQLSchema>;
  skipDocDirective: Maybe<DirectiveName[]>;
  collapsible: Maybe<CollapsibleOption>;
  parentType: Maybe<string>;
  groups: Maybe<SchemaEntitiesGroupMap>;
  level: Maybe<SectionLevelValue>;
} = {
  ...PRINT_TYPE_DEFAULT_OPTIONS,
  basePath: "/",
  collapsible: undefined,
  customDirectives: {},
  groups: undefined,
  header: { toc: true, pagination: true } as Required<PrintTypeHeaderOptions>,
  level: undefined,
  parentType: undefined,
  schema: undefined,
  skipDocDirective: undefined,
  withAttributes: false,
};
