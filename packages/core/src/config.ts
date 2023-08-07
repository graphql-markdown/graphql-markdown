import { join } from "node:path";
import { tmpdir } from "node:os";

import type {
  CliOptions,
  ConfigDocOptions,
  ConfigOptions,
  ConfigPrintTypeOptions,
  CustomDirective,
  CustomDirectiveOptions,
  DirectiveName,
  GroupByDirectiveOptions,
  LoaderOption,
  Options,
  PackageName,
  TypeDiffMethod,
} from "@graphql-markdown/types";

import { loadConfiguration } from "./graphql-config";

export enum DiffMethod {
  NONE = "NONE",
  FORCE = "FORCE",
}

export enum DeprecatedOption {
  DEFAULT = "default",
  GROUP = "group",
  SKIP = "skip",
}

export const DOCS_URL = "https://graphql-markdown.github.io/docs" as const;
export const PACKAGE_NAME = "@graphql-markdown/docusaurus" as const;
export const ASSET_HOMEPAGE_LOCATION = join(
  __dirname,
  "..",
  "assets",
  "generated.md",
);

export const DEFAULT_OPTIONS: Required<
  Omit<ConfigOptions, "groupByDirective" | "customDirective" | "loaders">
> & {
  groupByDirective: GroupByDirectiveOptions | undefined;
  customDirective: CustomDirective | undefined;
  loaders: LoaderOption | undefined;
} = {
  id: "default",
  baseURL: "schema",
  customDirective: undefined,
  diffMethod: DiffMethod.NONE as TypeDiffMethod,
  docOptions: {
    index: false,
    pagination: true,
    toc: true,
  },
  groupByDirective: undefined,
  homepage: ASSET_HOMEPAGE_LOCATION,
  linkRoot: "/",
  loaders: undefined,
  pretty: false,
  printer: "@graphql-markdown/printer-legacy" as PackageName,
  printTypeOptions: {
    codeSection: true,
    deprecated: DeprecatedOption.DEFAULT,
    parentTypePrefix: true,
    relatedTypeSection: true,
    typeBadges: true,
  },
  rootPath: "./docs",
  schema: "./schema.graphql",
  tmpDir: join(tmpdir(), PACKAGE_NAME),
  skipDocDirective: [],
} as const;

export async function buildConfig(
  configFileOpts?: ConfigOptions,
  cliOpts?: CliOptions,
  id?: string,
): Promise<Options> {
  if (typeof cliOpts === "undefined" || cliOpts === null) {
    cliOpts = {};
  }

  const graphqlConfig = await loadConfiguration(id);
  const config: ConfigOptions = {
    ...DEFAULT_OPTIONS,
    ...graphqlConfig,
    ...configFileOpts,
  } as const;

  const baseURL = cliOpts.base ?? config.baseURL!;
  const skipDocDirective = getSkipDocDirectives(cliOpts, config);

  return {
    baseURL,
    customDirective: getCustomDirectives(
      config.customDirective,
      skipDocDirective,
    ),
    diffMethod: getDiffMethod(
      cliOpts.diff ?? config.diffMethod!,
      cliOpts.force,
    ),
    docOptions: getDocOptions(cliOpts, config.docOptions),
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) ?? config.groupByDirective,
    homepageLocation:
      cliOpts.homepage ?? config.homepage ?? DEFAULT_OPTIONS.homepage,
    id: id ?? DEFAULT_OPTIONS.id,
    linkRoot: cliOpts.link ?? config.linkRoot ?? DEFAULT_OPTIONS.linkRoot,
    loaders: config.loaders,
    outputDir: join(cliOpts.root ?? config.rootPath!, baseURL),
    prettify: cliOpts.pretty ?? config.pretty ?? DEFAULT_OPTIONS.pretty,
    printer: (config.printer ?? DEFAULT_OPTIONS.printer)!,
    printTypeOptions: getPrintTypeOptions(cliOpts, config.printTypeOptions),
    schemaLocation: cliOpts.schema ?? config.schema ?? DEFAULT_OPTIONS.schema,
    skipDocDirective,
    tmpDir: cliOpts.tmp ?? config.tmpDir ?? DEFAULT_OPTIONS.tmpDir,
  };
}

export function getCustomDirectives(
  customDirectiveOptions?: CustomDirective,
  skipDocDirective?: DirectiveName[],
): CustomDirective | undefined {
  if (
    typeof customDirectiveOptions === "undefined" ||
    Object.keys(customDirectiveOptions).length === 0
  ) {
    return undefined;
  }

  for (const [name, option] of Object.entries<CustomDirectiveOptions>(
    customDirectiveOptions,
  )) {
    if (
      Array.isArray(skipDocDirective) &&
      skipDocDirective.includes(name as DirectiveName)
    ) {
      delete customDirectiveOptions[name as DirectiveName];
    } else if (
      (!("descriptor" in option) || typeof option.descriptor !== "function") &&
      (!("tag" in option) || typeof option.tag !== "function")
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

export function getDiffMethod(
  diff: TypeDiffMethod,
  force: boolean = false,
): TypeDiffMethod {
  return force ? DiffMethod.FORCE : diff;
}

export function getDocOptions(
  cliOpts?: CliOptions,
  configOptions?: ConfigDocOptions,
): Required<ConfigDocOptions> {
  return {
    pagination:
      (!cliOpts?.noPagination && configOptions?.pagination) ??
      DEFAULT_OPTIONS.docOptions.pagination!,
    toc:
      (!cliOpts?.noToc && configOptions?.toc) ??
      DEFAULT_OPTIONS.docOptions.toc!,
    index:
      (cliOpts?.index || configOptions?.index) ??
      DEFAULT_OPTIONS.docOptions.index!,
  };
}

export function getPrintTypeOptions(
  cliOpts?: CliOptions,
  configOptions?: ConfigPrintTypeOptions,
): Required<ConfigPrintTypeOptions> {
  return {
    codeSection:
      (!cliOpts?.noCode && configOptions?.codeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.codeSection!,
    deprecated:
      cliOpts?.deprecated ??
      configOptions?.deprecated ??
      DEFAULT_OPTIONS.printTypeOptions.deprecated!,
    parentTypePrefix:
      (!cliOpts?.noParentType && configOptions?.parentTypePrefix) ??
      DEFAULT_OPTIONS.printTypeOptions.parentTypePrefix!,
    relatedTypeSection:
      (!cliOpts?.noRelatedType && configOptions?.relatedTypeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.relatedTypeSection!,
    typeBadges:
      (!cliOpts?.noTypeBadges && configOptions?.typeBadges) ??
      DEFAULT_OPTIONS.printTypeOptions.typeBadges!,
  };
}

export function getSkipDocDirectives(
  cliOpts?: CliOptions,
  configFileOpts?: Pick<ConfigOptions, "skipDocDirective" | "printTypeOptions">,
): DirectiveName[] {
  const directiveList: DirectiveName[] = [].concat(
    (cliOpts?.skip ?? []) as never[],
    (configFileOpts?.skipDocDirective ?? []) as never[],
  );

  const skipDirectives = directiveList.map((option) =>
    getSkipDocDirective(option),
  );

  if (
    (typeof configFileOpts !== "undefined" &&
      configFileOpts.printTypeOptions?.deprecated === DeprecatedOption.SKIP) ||
    (typeof cliOpts !== "undefined" &&
      cliOpts?.deprecated === DeprecatedOption.SKIP)
  ) {
    skipDirectives.push("deprecated" as DirectiveName);
  }

  return skipDirectives;
}

export function getSkipDocDirective(option: DirectiveName): DirectiveName {
  const OPTION_REGEX = /^@(?<directive>\w+)$/;

  if (typeof option !== "string" || !OPTION_REGEX.test(option)) {
    throw new Error(`Invalid "${option}"`);
  }

  const {
    groups: { directive },
  } = OPTION_REGEX.exec(option) as RegExpExecArray & {
    groups: { directive: DirectiveName };
  };

  return directive;
}

export function parseGroupByOption(
  groupOptions: unknown,
): GroupByDirectiveOptions | undefined {
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
    return undefined;
  }

  const {
    directive,
    field,
    fallback = DEFAULT_GROUP,
  } = parsedOptions.groups as GroupByDirectiveOptions;
  return { directive, field, fallback } as GroupByDirectiveOptions;
}
