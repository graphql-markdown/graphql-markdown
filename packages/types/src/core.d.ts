import type { GraphQLSchema } from "graphql";
import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";

export type ConfigDocOptions = {
  index?: boolean;
  pagination?: boolean;
  toc?: boolean;
};

export type TypeDeprecatedOption = "default" | "group" | "skip";

export type ConfigPrintTypeOptions = {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
};

export type DiffMethodName = string & { _opaque: typeof DiffMethodName };
declare const DiffMethodName: unique symbol;
export type TypeDiffMethod = DiffMethodName | "NONE" | "FORCE";

type Pointer = string | UnnormalizedTypeDefPointer;

export type ConfigOptions = {
  id?: string;
  baseURL?: string;
  customDirective?: CustomDirective;
  diffMethod?: TypeDiffMethod;
  docOptions?: ConfigDocOptions;
  groupByDirective?: GroupByDirectiveOptions;
  homepage?: string;
  linkRoot?: string;
  loaders?: LoaderOption;
  pretty?: boolean;
  printer?: PackageName;
  printTypeOptions?: ConfigPrintTypeOptions;
  rootPath?: string;
  schema?: Pointer;
  tmpDir?: string;
  skipDocDirective?: DirectiveName[] | DirectiveName;
};

export type CliOptions = {
  schema?: Pointer;
  root?: string;
  base?: string;
  link?: string;
  homepage?: string;
  noCode?: boolean;
  noPagination?: boolean;
  noParentType?: boolean;
  noRelatedType?: boolean;
  noToc?: boolean;
  noTypeBadges?: boolean;
  index?: boolean;
  force?: boolean;
  diff?: TypeDiffMethod;
  tmp?: string;
  groupByDirective?: string;
  skip?: string[] | string;
  deprecated?: TypeDeprecatedOption;
  pretty?: boolean;
};

export type Options = Omit<
  ConfigOptions,
  "homepage" | "pretty" | "schema" | "rootPath"
> & {
  homepageLocation: string;
  outputDir: string;
  prettify: boolean;
  schemaLocation: Pointer;
  printer: PackageName;
  tmpDir: string;
  baseURL: string;
  linkRoot: string;
  skipDocDirective: DirectiveName[];
  docOptions: Required<ConfigDocOptions>;
  printTypeOptions: Required<ConfigPrintTypeOptions>;
};

export type FunctionCheckSchemaChanges = (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod?: DiffMethodName,
) => Promise<boolean>;

export type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

export type { GraphQLProjectConfig } from "graphql-config";
