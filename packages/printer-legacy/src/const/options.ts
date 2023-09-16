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
    | "collapsible"
    | "groups"
    | "level"
    | "onlyDocDirective"
    | "parentType"
    | "schema"
    | "skipDocDirective"
  >
> & {
  collapsible: Maybe<CollapsibleOption>;
  groups: Maybe<SchemaEntitiesGroupMap>;
  level: Maybe<SectionLevelValue>;
  onlyDocDirective: Maybe<DirectiveName[]>;
  parentType: Maybe<string>;
  schema: Maybe<GraphQLSchema>;
  skipDocDirective: Maybe<DirectiveName[]>;
} = {
  ...PRINT_TYPE_DEFAULT_OPTIONS,
  basePath: "/",
  collapsible: undefined,
  customDirectives: {},
  groups: undefined,
  header: { toc: true, pagination: true } as Required<PrintTypeHeaderOptions>,
  level: undefined,
  onlyDocDirective: undefined,
  parentType: undefined,
  schema: undefined,
  skipDocDirective: undefined,
  withAttributes: false,
};
