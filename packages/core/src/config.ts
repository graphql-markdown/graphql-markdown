import { join } from "node:path";
import { tmpdir } from "node:os";

import { DocumentLoaders } from "@graphql-markdown/utils/graphql";

import { parseGroupByOption } from "./groupInfo";
import {
  DocOptions,
  PluginOptions,
  PrintTypeOptions,
  CliOptions,
  ConfigOptions,
  CliPrintTypeOptions,
  CliDocOptions,
  DiffMethodType,
  DiffMethods,
  GetDiffMethod,
} from "./type";

export const PACKAGE_NAME: string = "@graphql-markdown/docusaurus";
export const ASSETS_LOCATION: string = join(__dirname, "../assets/");

export const COMPARE_METHOD_DEFAULT: DiffMethods = {
  FORCE: {
    toString: () => "FORCE",
    diff: () => Promise.resolve(true),
  },
  NONE: {
    toString: () => "NONE",
    diff: () => Promise.resolve(true),
  },
};

export const DEFAULT_OPTIONS: PluginOptions = {
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: join(ASSETS_LOCATION, "generated.md"),
  tmpDir: join(tmpdir(), PACKAGE_NAME),
  loaders: {} as DocumentLoaders,
  pretty: false,
  printer: "@graphql-markdown/printer-legacy",
  docOptions: {
    pagination: true,
    toc: true,
    index: false,
  },
  printTypeOptions: {
    parentTypePrefix: true,
    relatedTypeSection: true,
    typeBadges: true,
  },
  groupByDirective: undefined,
  skipDocDirective: undefined
};

export const buildConfig = async (
  cliOpts: CliOptions,
  configFileOpts?: PluginOptions
): Promise<ConfigOptions> => {
  let config: PluginOptions = DEFAULT_OPTIONS;

  if (typeof configFileOpts !== "undefined" && configFileOpts !== null) {
    config = { ...DEFAULT_OPTIONS, ...configFileOpts };
  }

  const baseURL: string = cliOpts.base ?? config.baseURL;
  const rootPath: string = cliOpts.root ?? config.rootPath;
  const schemaDiff: DiffMethodType = await getDiffMethod(cliOpts.diff ?? config.diffMethod, cliOpts.force);

  return {
    baseURL,
    rootPath,
    schemaDiff,
    loaders: config.loaders,
    schema: cliOpts.schema ?? config.schema,
    outputDir: join(rootPath, baseURL),
    linkRoot: cliOpts.link ?? config.linkRoot,
    homepage: cliOpts.homepage ?? config.homepage,
    tmpDir: cliOpts.tmp ?? config.tmpDir,
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective,
    pretty: cliOpts.pretty ?? config.pretty,
    docOptions: getDocOptions(cliOpts, config.docOptions),
    printTypeOptions: gePrintTypeOptions(cliOpts, config.printTypeOptions),
    printer: config.printer,
    skipDocDirective: getSkipDocDirective(
      cliOpts.skip ?? config.skipDocDirective
    ),
  };
};

const getDiffMethod = async (
  method: string | undefined,
  force: boolean,
  module: string = "@graphql-markdown/diff"
): Promise<DiffMethodType> => {
  if (force) {
    return COMPARE_METHOD_DEFAULT['FORCE'] as DiffMethodType;
  }

  const diffModule = await import(module);
  if (typeof diffModule === "undefined") {
    return COMPARE_METHOD_DEFAULT['NONE'] as DiffMethodType;
  }

  const getDiffMethod: GetDiffMethod = diffModule.getDiffMethod;

  const diffMethod = getDiffMethod(method);
  if (typeof diffMethod === "undefined") {
    return COMPARE_METHOD_DEFAULT['NONE'] as DiffMethodType;
  }

  return diffMethod;
};

const getDocOptions = (
  cliOpts: CliDocOptions,
  configOptions: DocOptions
): DocOptions => {
  return {
    pagination: !cliOpts.noPagination && configOptions.pagination,
    toc: !cliOpts.noToc && configOptions.toc,
    index: cliOpts.index || configOptions.index,
  };
};

function gePrintTypeOptions(
  cliOpts: CliPrintTypeOptions,
  configOptions: PrintTypeOptions
): PrintTypeOptions {
  return {
    parentTypePrefix: !cliOpts.noParentType && configOptions.parentTypePrefix,
    relatedTypeSection:
      !cliOpts.noRelatedType && configOptions.relatedTypeSection,
    typeBadges: !cliOpts.noTypeBadges && configOptions.typeBadges,
  };
}

function getSkipDocDirective(option: string | undefined): string | undefined {
  const OPTION_REGEX = /^@(?<directive>\w+)$/;

  if (typeof option !== "string") {
    return undefined;
  }

  const parsedOption = OPTION_REGEX.exec(option);

  if (
    typeof parsedOption === "undefined" ||
    parsedOption == null ||
    typeof parsedOption.groups === "undefined"
  ) {
    throw new Error(`Invalid "${option}"`);
  }

  return parsedOption.groups["directive"];
}
