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

import {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "@graphql-markdown/formatters/defaults";

export enum TypeHierarchy {
  API = "api",
  // Used cross-package in packages/core/src/renderer.ts and config.ts;
  // fallow can't trace cross-workspace callers when dist/ is excluded.
  // fallow-ignore-next-line unused-enum-member
  ENTITY = "entity",
  FLAT = "flat",
}

export enum SectionLevels {
  /**
   * @deprecated Use `SectionLevels.LEVEL` instead.
   */
  // fallow-ignore-next-line unused-enum-member
  NONE = "",
  LEVEL = "#",
}

export const PRINT_TYPE_DEFAULT_OPTIONS: Required<
  Omit<PrinterConfigPrintTypeOptions, "exampleSection">
> & {
  exampleSection: PrintTypeOptions["exampleSection"];
} = {
  deprecated: "default" as const,
  exampleSection: undefined,
  metatags: [] as const,
  parentTypePrefix: true as const,
  typeBadges: true as const,
  hierarchy: { [TypeHierarchy.API]: {} } as const,
};

/**
 * Clean runtime options passed through the printer.
 */
export const DEFAULT_OPTIONS: Required<
  Omit<
    PrintTypeOptions,
    | "afterDiffCheckHook"
    | "afterGenerateIndexMetafileHook"
    | "afterRenderHomepageHook"
    | "afterRenderRootTypesHook"
    | "afterRenderTypeEntitiesHook"
    | "afterSchemaLoadHook"
    | "beforeDiffCheckHook"
    | "beforeGenerateIndexMetafileHook"
    | "beforeRenderHomepageHook"
    | "beforeRenderRootTypesHook"
    | "beforeRenderTypeEntitiesHook"
    | "beforeSchemaLoadHook"
    | "collapsible"
    | "exampleSection"
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
  exampleSection: PrintTypeOptions["exampleSection"];
  groups: Maybe<SchemaEntitiesGroupMap>;
  level: Maybe<SectionLevelValue>;
  onlyDocDirectives: GraphQLDirective[];
  parentType: Maybe<string>;
  schema: Maybe<GraphQLSchema>;
  skipDocDirectives: GraphQLDirective[];
} = {
  deprecated: PRINT_TYPE_DEFAULT_OPTIONS.deprecated,
  basePath: "/" as const,
  collapsible: undefined,
  customDirectives: {} as const,
  exampleSection: undefined,
  groups: undefined,
  frontMatter: {} as FrontMatterOptions,
  level: undefined,
  metatags: PRINT_TYPE_DEFAULT_OPTIONS.metatags,
  onlyDocDirectives: [] as const,
  operationNamespaceParts: null,
  parentType: undefined,
  parentTypePrefix: PRINT_TYPE_DEFAULT_OPTIONS.parentTypePrefix,
  schema: undefined,
  skipDocDirectives: [] as const,
  typeBadges: PRINT_TYPE_DEFAULT_OPTIONS.typeBadges,
  withAttributes: false as const,
  sectionHeaderId: true as const,
  hierarchy: PRINT_TYPE_DEFAULT_OPTIONS.hierarchy,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
};
