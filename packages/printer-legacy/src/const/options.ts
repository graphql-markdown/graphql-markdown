import type {
  CollapsibleOption,
  GraphQLDirective,
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
    | "onlyDocDirectives"
    | "parentType"
    | "schema"
    | "skipDocDirectives"
  >
> & {
  collapsible: Maybe<CollapsibleOption>;
  groups: Maybe<SchemaEntitiesGroupMap>;
  level: Maybe<SectionLevelValue>;
  onlyDocDirectives: GraphQLDirective[];
  parentType: Maybe<string>;
  schema: Maybe<GraphQLSchema>;
  skipDocDirectives: GraphQLDirective[];
} = {
  ...PRINT_TYPE_DEFAULT_OPTIONS,
  basePath: "/",
  collapsible: undefined,
  customDirectives: {},
  groups: undefined,
  header: { toc: true, pagination: true } as Required<PrintTypeHeaderOptions>,
  level: undefined,
  onlyDocDirectives: [],
  parentType: undefined,
  schema: undefined,
  skipDocDirectives: [],
  withAttributes: false,
};
