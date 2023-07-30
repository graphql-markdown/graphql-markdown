import { join } from "node:path";
import { tmpdir } from "node:os";

import type { BaseLoaderOptions} from "@graphql-tools/utils";

import { hasProperty } from "@graphql-markdown/utils";
import type { CustomDirective, DirectiveName, GroupByDirectiveOptions } from "@graphql-markdown/utils";

import { loadConfiguration } from "./graphql-config";

export const DOCS_URL = "https://graphql-markdown.github.io/docs";
export const PACKAGE_NAME = "@graphql-markdown/docusaurus";
export const ASSETS_LOCATION = join(__dirname, "../assets/");

export type ConfigDocOptions = {
  index: boolean
  pagination: boolean
  toc: boolean
}

export type TypeDeprecatedOption = "default" | "group" | "skip"

export type ConfigPrintTypeOptions = {
  codeSection: boolean
  deprecated: TypeDeprecatedOption,
  parentTypePrefix: boolean
  relatedTypeSection: boolean
  typeBadges: boolean
}

export type Loader = {
  [name: ClassName]: PackageName | PackageConfig 
}

export type PackageOptionsConfig = BaseLoaderOptions & RootTypes

export type PackageConfig = {
  module: PackageName 
  options?: PackageOptionsConfig 
}

export type RootTypes = { query?: string, mutation?: string, subscription?: string }

export type PackageName = string & {_opaque: typeof PackageName};
declare const PackageName: unique symbol;

export type ClassName = string & {_opaque: typeof ClassName};
declare const ClassName: unique symbol;


export type DiffMethod = string | "NONE" | "FORCE"

export type ConfigOptions = {
  baseURL: string
  customDirective?: CustomDirective
  diffMethod?: DiffMethod
  docOptions: ConfigDocOptions
  groupByDirective?: GroupByDirectiveOptions
  homepage: string
  linkRoot: string
  loaders: Loader
  pretty: boolean
  printer?: PackageName
  printTypeOptions: ConfigPrintTypeOptions
  rootPath: string
  schema: string
  tmpDir: string
  skipDocDirective?: DirectiveName[]
}

export type CliOptions = {
  schema?: string
  root?: string
  base?: string
  link?: string
  homepage?: string
  noCode?: boolean
  noPagination?: boolean
  noParentType?: boolean
  noRelatedType?: boolean
  noToc?: boolean
  noTypeBadges?: boolean
  index?: boolean
  force?: boolean
  diff?: string
  tmp?: string
  groupByDirective?: string
  skip?: string[]
  deprecated?: TypeDeprecatedOption
  pretty?: boolean
}

export type Options = Omit<ConfigOptions, "homepage" | "pretty" | "schema" | "rootPath"> & { 
  homepageLocation: string, 
  outputDir: string, 
  prettify: boolean, 
  schemaLocation: string
};

export const DEFAULT_OPTIONS: ConfigOptions = {
  baseURL: "schema",
  customDirective: undefined,
  diffMethod: undefined,
  docOptions: {
    index: false,
    pagination: true,
    toc: true,
  },
  groupByDirective: undefined,
  homepage: join(ASSETS_LOCATION, "generated.md"),
  linkRoot: "/",
  loaders: {},
  pretty: false,
  printer: "@graphql-markdown/printer-legacy" as PackageName,
  printTypeOptions: {
    codeSection: true,
    deprecated: "default",
    parentTypePrefix: true,
    relatedTypeSection: true,
    typeBadges: true,
  },
  rootPath: "./docs",
  schema: "./schema.graphql",
  tmpDir: join(tmpdir(), PACKAGE_NAME),
  skipDocDirective: [],
};

export function buildConfig(configFileOpts: ConfigOptions, cliOpts: CliOptions, id?: string): Options {
  if (typeof cliOpts === "undefined" || cliOpts === null) {
    cliOpts = {};
  }

  const graphqlConfig = loadConfiguration(id);
  const config = { ...DEFAULT_OPTIONS, ...graphqlConfig, ...configFileOpts };

  const baseURL = cliOpts.base ?? config.baseURL;
  const skipDocDirective = getSkipDocDirectives(cliOpts, config);

  return {
    baseURL,
    customDirective: getCustomDirectives(
      config.customDirective,
      skipDocDirective,
    ),
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod!, cliOpts.force),
    docOptions: getDocOptions(cliOpts, config.docOptions),
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective,
    homepageLocation: cliOpts.homepage ?? config.homepage,
    linkRoot: cliOpts.link ?? config.linkRoot,
    loaders: config.loaders,
    outputDir: join(cliOpts.root ?? config.rootPath, baseURL),
    prettify: cliOpts.pretty ?? config.pretty,
    printer: config.printer,
    printTypeOptions: getPrintTypeOptions(cliOpts, config.printTypeOptions),
    schemaLocation: cliOpts.schema ?? config.schema,
    skipDocDirective,
    tmpDir: cliOpts.tmp ?? config.tmpDir,
  };
}

export function getCustomDirectives(customDirectiveOptions: CustomDirective | undefined, skipDocDirective: DirectiveName[]): CustomDirective | undefined {
  if (
    typeof customDirectiveOptions === "undefined" ||
    (typeof customDirectiveOptions === "object" &&
      Object.keys(customDirectiveOptions).length == 0)
  ) {
    return undefined;
  }

  for (const [name, option] of Object.entries(customDirectiveOptions)) {
    if (skipDocDirective.includes(name as DirectiveName)) {
      delete customDirectiveOptions[name as DirectiveName];
    } else if (
      (hasProperty(option, "descriptor") === false ||
        typeof option.descriptor !== "function") &&
      (hasProperty(option, "tag") === false || typeof option.tag !== "function")
    ) {
      throw new Error(
        `Wrong format for plugin custom directive "${name}".\nPlease refer to ${DOCS_URL}/advanced/custom-directive`,
      );
    }
  }

  return Object.keys(customDirectiveOptions).length === 0
    ? undefined
    : customDirectiveOptions;
}

export function getDiffMethod(diff: DiffMethod, force: boolean = false) : DiffMethod {
  return force ? "FORCE" : diff;
}

export function getDocOptions(cliOpts: CliOptions, configOptions: ConfigDocOptions): ConfigDocOptions {
  return {
    pagination: !cliOpts.noPagination && configOptions.pagination,
    toc: !cliOpts.noToc && configOptions.toc,
    index: cliOpts.index || configOptions.index,
  };
}

export function getPrintTypeOptions(cliOpts: CliOptions, configOptions: ConfigPrintTypeOptions): ConfigPrintTypeOptions {
  return {
    codeSection: !cliOpts.noCode && configOptions.codeSection,
    deprecated:
      cliOpts.deprecated ??
      configOptions?.deprecated ??
      DEFAULT_OPTIONS.printTypeOptions.deprecated,
    parentTypePrefix: !cliOpts.noParentType && configOptions.parentTypePrefix,
    relatedTypeSection:
      !cliOpts.noRelatedType && configOptions.relatedTypeSection,
    typeBadges: !cliOpts.noTypeBadges && configOptions.typeBadges,
  };
}

export function getSkipDocDirectives(cliOpts: CliOptions, configFileOpts: ConfigOptions): DirectiveName[] {
  const directiveList: DirectiveName[] = [].concat(
    (cliOpts?.skip ?? []) as never[],
    (configFileOpts?.skipDocDirective ?? []) as never[],
  );

  const skipDirectives = directiveList.map((option) =>
    getSkipDocDirective(option),
  );

  if (
    (hasProperty(configFileOpts, "printTypeOptions") === true &&
      configFileOpts.printTypeOptions.deprecated === "skip") ||
    (hasProperty(cliOpts, "deprecated") === true &&
      cliOpts.deprecated === "skip")
  ) {
    skipDirectives.push("deprecated" as DirectiveName);
  }

  return skipDirectives;
}

export function getSkipDocDirective(option: DirectiveName): DirectiveName {
  const OPTION_REGEX = /^@(?<directive>\w+)$/;

  if (typeof option !== "string") {
    throw new Error(`Invalid "${option}"`);
  }

  const parsedOption = OPTION_REGEX.exec(option);

  if (typeof parsedOption === "undefined" || parsedOption == null) {
    throw new Error(`Invalid "${option}"`);
  }

  return parsedOption.groups?.directive as DirectiveName;
}

export function parseGroupByOption(groupOptions: unknown): GroupByDirectiveOptions | undefined {
  const DEFAULT_GROUP = "Miscellaneous";
  const OPTION_REGEX =
    /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

  if (typeof groupOptions !== "string") {
    return undefined;
  }

  const parsedOptions = OPTION_REGEX.exec(groupOptions);

  if (typeof parsedOptions === "undefined" || parsedOptions == null) {
    throw new Error(`Invalid "${groupOptions}"`);
  }

  if (!("groups" in parsedOptions)) {
    return undefined
  }

  const { directive, field, fallback = DEFAULT_GROUP } = parsedOptions.groups as GroupByDirectiveOptions;
  return { directive, field, fallback } as GroupByDirectiveOptions;
}
