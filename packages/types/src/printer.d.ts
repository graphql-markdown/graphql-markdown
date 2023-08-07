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

export type PrintTypeOptions = {
  basePath: string;
  codeSection?: boolean;
  collapsible?: CollapsibleOption;
  customDirectives?: CustomDirectiveMap;
  deprecated?: TypeDeprecatedOption;
  groups?: SchemaEntitiesGroupMap | undefined;
  level?: SectionLevelValue;
  parentType?: string;
  parentTypePrefix: boolean;
  relatedTypeSection?: boolean;
  schema?: GraphQLSchema;
  skipDocDirective?: DirectiveName[];
  typeBadges?: boolean;
  withAttributes?: boolean;
  header?: { toc?: boolean; pagination?: boolean };
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

export type IGetRelation = (
  type: unknown,
  schema: GraphQLSchema,
) => Record<string, unknown[]> | undefined;
