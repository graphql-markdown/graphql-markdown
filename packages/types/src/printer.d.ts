import type {
  Maybe,
  TypeDeprecatedOption,
  SchemaEntitiesGroupMap,
  DirectiveName,
  GraphQLSchema,
  CustomDirectiveMap,
  ConfigPrintTypeOptions,
} from ".";

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

export type PrinterConfigPrintTypeOptions = {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
};

export type CollapsibleOption = { dataOpen: string; dataClose: string };

export type PrintTypeHeaderOptions = { toc?: boolean; pagination?: boolean };

export type PrintTypeOptions = {
  basePath: string;
  codeSection?: Maybe<boolean>;
  collapsible?: Maybe<CollapsibleOption>;
  customDirectives?: Maybe<CustomDirectiveMap>;
  deprecated?: Maybe<TypeDeprecatedOption>;
  groups?: Maybe<SchemaEntitiesGroupMap>;
  level?: Maybe<SectionLevelValue>;
  parentType?: Maybe<string>;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  schema?: Maybe<GraphQLSchema>;
  skipDocDirective?: Maybe<DirectiveName[]>;
  typeBadges?: boolean;
  withAttributes?: boolean;
  header?: Maybe<PrintTypeHeaderOptions>;
};

export type SectionLevelValue = string & { _opaque: typeof SectionLevelValue };
declare const SectionLevelValue: unique symbol;
export type SectionLevel = SectionLevelValue | "####" | "#####";

export type Badge = {
  text: string | TypeLocale;
  classname: string;
};

export type TypeLink = {
  text: string;
  url: string;
};

export type PrintLinkOptions = Pick<
  PrintTypeOptions,
  | "groups"
  | "parentTypePrefix"
  | "parentType"
  | "basePath"
  | "withAttributes"
  | "skipDocDirective"
  | "deprecated"
> &
  Partial<PrintTypeOptions>;

export type PrintDirectiveOptions = Pick<
  PrintTypeOptions,
  "basePath" | "deprecated" | "parentTypePrefix"
> &
  Partial<PrintTypeOptions>;

export abstract class IPrinter {
  static init(
    schema: Maybe<GraphQLSchema>,
    baseURL: string,
    linkRoot: string,
    options: Maybe<PrinterOptions>,
  ): void;
  static printHeader(
    id: string,
    title: string,
    options: PrinterOptions & PrinterConfig,
  ): string;
  static printDescription(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
    noText: string,
  ): string;
  static printCode(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): string;
  static printCustomDirectives(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printCustomTags(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printTypeMetadata(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printRelations(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printType(
    name: string,
    type: unknown,
    options: Maybe<Partial<PrinterOptions & PrinterConfig>>,
  ): MDXString;
}
export type Printer = typeof IPrinter;

export type PrinterConfig = {
  schema: Maybe<GraphQLSchema>;
  baseURL: string;
  linkRoot: string;
};

export type PrinterOptions = {
  customDirectives?: Maybe<CustomDirectiveMap>;
  deprecated?: Maybe<TypeDeprecatedOption>;
  groups?: Maybe<SchemaEntitiesGroupMap>;
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  skipDocDirective?: Maybe<DirectiveName[]>;
};
