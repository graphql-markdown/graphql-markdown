import type {
  ConfigPrintTypeOptions,
  FrontMatterOptions,
  TypeDeprecatedOption,
  TypeExampleSectionOption,
  TypeHierarchyObjectType,
} from "./core";
import type {
  GraphQLDirective,
  GraphQLSchema,
  SchemaEntitiesGroupMap,
} from "./graphql";
import type { CustomDirectiveMap } from "./helpers";
import type { Maybe, MDXString } from "./utils";

export interface MDXSupportType {
  formatMDXAdmonition: (
    { text, title, type, icon }: AdmonitionType,
    meta: Maybe<MetaOptions>,
  ) => MDXString;
  formatMDXBadge: ({ text, classname }: Badge) => MDXString;
  formatMDXBullet: (text?: string) => MDXString;
  formatMDXDetails: ({
    dataOpen,
    dataClose,
  }: {
    dataOpen?: Maybe<string>;
    dataClose?: Maybe<string>;
  }) => MDXString;
  formatMDXLink: (link: TypeLink) => TypeLink;
  formatMDXNameEntity: (name: string, parentType?: Maybe<string>) => MDXString;
  formatMDXSpecifiedByLink: (url: string) => MDXString;
  formatMDXFrontmatter: (
    props: Maybe<FrontMatterOptions>,
    formatted: Maybe<string[]>,
  ) => MDXString;
  mdxDeclaration: string;
}

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
export type TypeLocale = string | { singular: string; plural: string };
export type RootTypeLocale = Record<RootTypeName, TypeLocale>;

export interface MetaOptions {
  generatorFrameworkName?: Maybe<string>;
  generatorFrameworkVersion?: Maybe<string>;
}

export interface AdmonitionType {
  icon: Maybe<string>;
  text: string;
  title: Maybe<string>;
  type: string;
}

export interface PrinterConfigPrintTypeOptions {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  exampleSection?: TypeExampleSectionOption | boolean;
  hierarchy?: TypeHierarchyObjectType;
  metatags?: Record<string, string>[];
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
}

export interface CollapsibleOption {
  dataOpen: string;
  dataClose: string;
}

export type PrintTypeOptions = Partial<MDXSupportType> & {
  basePath: string;
  codeSection?: Maybe<boolean>;
  collapsible?: Maybe<CollapsibleOption>;
  customDirectives?: Maybe<CustomDirectiveMap>;
  deprecated?: Maybe<TypeDeprecatedOption>;
  exampleSection?: Maybe<TypeExampleSectionOption | boolean>;
  frontMatter?: Maybe<FrontMatterOptions>;
  groups?: Maybe<SchemaEntitiesGroupMap>;
  hierarchy?: Maybe<TypeHierarchyObjectType>;
  level?: Maybe<SectionLevelValue>;
  meta?: Maybe<MetaOptions>;
  metatags?: Maybe<Record<string, string>[]>;
  onlyDocDirectives?: GraphQLDirective[];
  parentType?: Maybe<string>;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  schema?: Maybe<GraphQLSchema>;
  skipDocDirectives?: GraphQLDirective[];
  typeBadges?: boolean;
  withAttributes?: boolean;
};

export type SectionLevelValue = string & {
  _opaque: typeof SECTION_LEVEL_VALUE;
};
declare const SECTION_LEVEL_VALUE: unique symbol;
export type SectionLevel = SectionLevelValue | "####" | "#####";

export interface Badge {
  text: TypeLocale | string;
  classname: string;
}

export interface TypeLink {
  text: string;
  url: string;
}

export type PrintLinkOptions = Partial<PrintTypeOptions> &
  Pick<
    PrintTypeOptions,
    | "basePath"
    | "deprecated"
    | "formatMDXLink"
    | "groups"
    | "hierarchy"
    | "onlyDocDirectives"
    | "parentType"
    | "parentTypePrefix"
    | "skipDocDirectives"
    | "withAttributes"
  >;

export type PrintDirectiveOptions = Partial<PrintTypeOptions> &
  Pick<PrintTypeOptions, "basePath" | "deprecated" | "parentTypePrefix">;

/**
 * @public
 */
export abstract class IPrinter {
  static async init(
    schema: Maybe<GraphQLSchema>,
    baseURL: string,
    linkRoot: string,
    options: Maybe<PrinterOptions>,
    mdxParser?: PackageName,
  ): Promise<void>;
  static printHeader(
    id: string,
    title: string,
    options: PrinterConfig & PrinterOptions,
  ): string;
  static printDescription(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
    noText: string,
  ): string;
  static printCode(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): string;
  static printCustomDirectives(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;
  static printCustomTags(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;
  static printTypeMetadata(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;
  static printRelations(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;
  static printType(
    name: string,
    type: unknown,
    options?: Maybe<Partial<PrintTypeOptions>>,
  ): MDXString;
}
export type Printer = typeof IPrinter;

export interface PrinterConfig {
  baseURL: string;
  linkRoot: string;
  schema: Maybe<GraphQLSchema>;
}

export interface PrinterOptions {
  customDirectives?: Maybe<CustomDirectiveMap>;
  deprecated?: Maybe<TypeDeprecatedOption>;
  groups?: Maybe<SchemaEntitiesGroupMap>;
  meta?: Maybe<MetaOptions>;
  metatags?: Maybe<Record<string, string>[]>;
  onlyDocDirectives?: GraphQLDirective[];
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  skipDocDirectives?: GraphQLDirective[];
}
