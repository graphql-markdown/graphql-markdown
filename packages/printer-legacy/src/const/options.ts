import type {
  CollapsibleOption,
  DirectiveName,
  GraphQLSchema,
  PrintTypeOptions,
  PrinterConfigPrintTypeOptions,
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
    "schema" | "skipDocDirective" | "collapsible" | "parentType"
  >
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
  level: SectionLevels.LEVEL_3 as SectionLevelValue,
  parentType: undefined,
  schema: undefined,
  skipDocDirective: undefined,
  withAttributes: false,
};
