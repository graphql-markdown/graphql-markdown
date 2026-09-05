import type {
  CollapsibleOption,
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
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
} from "@graphql-markdown/formatters/defaults";

export enum TypeHierarchy {
  API = "api",
  // Used only by unit tests for direct whitebox coverage.
  ENTITY = "entity",
  FLAT = "flat",
}

export enum SectionLevels {
  /**
   * @deprecated Use `SectionLevels.LEVEL` instead.
   */
  // Reserved for future usage.
  NONE = "",
  LEVEL = "#",
}

export const PRINT_TYPE_DEFAULT_OPTIONS: Required<
  Omit<PrinterConfigPrintTypeOptions, "customSections" | "exampleSection">
> & {
  customSections: PrintTypeOptions["customSections"];
  exampleSection: PrintTypeOptions["exampleSection"];
} = {
  customSections: undefined,
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
    | "collapsible"
    | "customSections"
    | "entity"
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
  customSections: PrintTypeOptions["customSections"];
  entity: PrintTypeOptions["entity"];
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
  customSections: PRINT_TYPE_DEFAULT_OPTIONS.customSections,
  entity: undefined,
  exampleSection: undefined,
  groups: undefined,
  frontMatter: {},
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
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
};
