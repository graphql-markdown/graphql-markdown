import type { GraphQLSchema } from "graphql";
import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";

import type {
  CustomDirective,
  DirectiveName,
  GroupByDirectiveOptions,
  LoaderOption,
  PackageName,
} from ".";

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
  baseURL?: Maybe<string>;
  customDirective?: Maybe<CustomDirective>;
  diffMethod?: Maybe<TypeDiffMethod>;
  docOptions?: Maybe<ConfigDocOptions>;
  groupByDirective?: Maybe<GroupByDirectiveOptions>;
  homepage?: Maybe<string>;
  id?: Maybe<string>;
  linkRoot?: Maybe<string>;
  loaders?: Maybe<LoaderOption>;
  pretty?: Maybe<boolean>;
  printer?: Maybe<PackageName>;
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  rootPath?: Maybe<string>;
  schema?: Maybe<Pointer>;
  skipDocDirective?: Maybe<DirectiveName[] | DirectiveName>;
  tmpDir?: Maybe<string>;
};

export type CliOptions = {
  base?: string;
  deprecated?: TypeDeprecatedOption;
  diff?: TypeDiffMethod;
  force?: boolean;
  groupByDirective?: string;
  homepage?: string;
  index?: boolean;
  link?: string;
  noCode?: boolean;
  noPagination?: boolean;
  noParentType?: boolean;
  noRelatedType?: boolean;
  noToc?: boolean;
  noTypeBadges?: boolean;
  pretty?: boolean;
  root?: string;
  schema?: Pointer;
  skip?: string[] | string;
  tmp?: string;
};

export type Options = Omit<
  ConfigOptions,
  "homepage" | "pretty" | "schema" | "rootPath"
> & {
  baseURL: string;
  docOptions: Required<ConfigDocOptions>;
  homepageLocation: string;
  linkRoot: string;
  outputDir: string;
  prettify: boolean;
  printer: PackageName;
  printTypeOptions: Required<ConfigPrintTypeOptions>;
  schemaLocation: Pointer;
  skipDocDirective: DirectiveName[];
  tmpDir: string;
};

export type FunctionCheckSchemaChanges = (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod?: DiffMethodName,
) => Promise<boolean>;

export type GeneratorOptions = Options & { loggerModule?: string };

export type { GraphQLProjectConfig } from "graphql-config";
