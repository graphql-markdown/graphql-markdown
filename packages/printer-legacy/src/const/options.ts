import type {
  CollapsibleOption,
  FrontMatterOptions,
  GraphQLDirective,
  GraphQLSchema,
  Maybe,
  PrintTypeOptions,
  PrinterConfigPrintTypeOptions,
  SchemaEntitiesGroupMap,
  SectionLevelValue,
} from "@graphql-markdown/types";

import MDXModule from "../mdx";

export enum TypeHierarchy {
  API = "api",
  ENTITY = "entity",
  FLAT = "flat",
}

export enum SectionLevels {
  NONE = "",
  LEVEL = "#",
}

export const PRINT_TYPE_DEFAULT_OPTIONS: Required<PrinterConfigPrintTypeOptions> =
  {
    codeSection: true as const,
    deprecated: "default" as const,
    exampleSection: false as const,
    metatags: [] as const,
    parentTypePrefix: true as const,
    relatedTypeSection: true as const,
    typeBadges: true as const,
    hierarchy: { [TypeHierarchy.API]: {} } as const,
  };

export const DEFAULT_OPTIONS: Required<
  Omit<
    PrintTypeOptions,
    | "collapsible"
    | "formatCategoryFolderName"
    | "groups"
    | "level"
    | "meta"
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
  basePath: "/" as const,
  collapsible: undefined,
  customDirectives: {} as const,
  groups: undefined,
  frontMatter: {} as FrontMatterOptions,
  level: undefined,
  metatags: [] as const,
  onlyDocDirectives: [] as const,
  parentType: undefined,
  schema: undefined,
  skipDocDirectives: [] as const,
  withAttributes: false as const,
  ...MDXModule,
};
