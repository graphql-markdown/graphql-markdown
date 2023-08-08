import type { GraphQLSchema } from "graphql";
import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";

import type {
  CustomDirective,
  GroupByDirectiveOptions,
  PackageName,
  LoaderOption,
  DirectiveName,
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
  id?: Maybe<string>;
  baseURL?: Maybe<string>;
  customDirective?: Maybe<CustomDirective>;
  diffMethod?: Maybe<TypeDiffMethod>;
  docOptions?: Maybe<ConfigDocOptions>;
  groupByDirective?: Maybe<GroupByDirectiveOptions>;
  homepage?: Maybe<string>;
  linkRoot?: Maybe<string>;
  loaders?: Maybe<LoaderOption>;
  pretty?: Maybe<boolean>;
  printer?: Maybe<PackageName>;
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  rootPath?: Maybe<string>;
  schema?: Maybe<Pointer>;
  tmpDir?: Maybe<string>;
  skipDocDirective?: Maybe<DirectiveName[] | DirectiveName>;
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

export type { GraphQLProjectConfig } from "graphql-config";
