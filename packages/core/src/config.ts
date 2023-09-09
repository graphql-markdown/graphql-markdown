import { join } from "node:path";
import { tmpdir } from "node:os";

import type {
  CliOptions,
  ConfigDocOptions,
  ConfigOptions,
  ConfigPrintTypeOptions,
  CustomDirective,
  DirectiveName,
  GroupByDirectiveOptions,
  LoaderOption,
  Maybe,
  Options,
  PackageName,
  TypeDeprecatedOption,
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
  Omit<ConfigOptions, "customDirective" | "groupByDirective" | "loaders">
> & {
  groupByDirective: Maybe<GroupByDirectiveOptions>;
  customDirective: Maybe<CustomDirective>;
  loaders: Maybe<LoaderOption>;
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

export function getSkipDocDirective(name: Maybe<DirectiveName>): DirectiveName {
  const OPTION_REGEX = /^@(?<directive>\w+)$/;

  if (typeof name !== "string" || !OPTION_REGEX.test(name)) {
    throw new Error(`Invalid "${name}"`);
  }

  const {
    groups: { directive },
  } = OPTION_REGEX.exec(name) as RegExpExecArray & {
    groups: { directive: DirectiveName };
  };

  return directive;
}

export function getSkipDocDirectives(
  cliOpts: Maybe<CliOptions>,
  configFileOpts: Maybe<
    Pick<ConfigOptions, "printTypeOptions" | "skipDocDirective">
  >,
): DirectiveName[] {
  const directiveList: DirectiveName[] = [].concat(
    (cliOpts?.skip ?? []) as never[],
    (configFileOpts?.skipDocDirective ?? []) as never[],
  );

  const skipDirectives = directiveList.map((option) =>
    getSkipDocDirective(option),
  );

  if (
    (configFileOpts &&
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      configFileOpts.printTypeOptions?.deprecated === DeprecatedOption.SKIP) ||
    (cliOpts && cliOpts.deprecated === DeprecatedOption.SKIP)
  ) {
    skipDirectives.push("deprecated" as DirectiveName);
  }

  return skipDirectives;
}

export function getCustomDirectives(
  customDirectiveOptions: Maybe<CustomDirective>,
  skipDocDirective?: Maybe<DirectiveName[]>,
): Maybe<CustomDirective> {
  if (
    !customDirectiveOptions ||
    Object.keys(customDirectiveOptions).length === 0
  ) {
    return undefined;
  }

  for (const [name, option] of Object.entries(customDirectiveOptions)) {
    if (
      Array.isArray(skipDocDirective) &&
      skipDocDirective.includes(name as DirectiveName)
    ) {
      delete customDirectiveOptions[name as DirectiveName];
    } else if (
      ("descriptor" in option && typeof option.descriptor !== "function") ||
      ("tag" in option && typeof option.tag !== "function") ||
      !("tag" in option || "descriptor" in option)
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
  return force
    ? DiffMethod.FORCE
    : (diff.toLocaleUpperCase() as TypeDiffMethod);
}

export function getDocOptions(
  cliOpts: Maybe<CliOptions>,
  configOptions: Maybe<ConfigDocOptions>,
): Required<ConfigDocOptions> {
  return {
    pagination:
      (!cliOpts?.noPagination && configOptions?.pagination) ??
      DEFAULT_OPTIONS.docOptions.pagination!,
    toc:
      (!cliOpts?.noToc && configOptions?.toc) ??
      DEFAULT_OPTIONS.docOptions.toc!,
    index:
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      (cliOpts?.index || configOptions?.index) ??
      DEFAULT_OPTIONS.docOptions.index!,
  } as Required<ConfigDocOptions>;
}

export function getPrintTypeOptions(
  cliOpts: Maybe<CliOptions>,
  configOptions: Maybe<ConfigPrintTypeOptions>,
): Required<ConfigPrintTypeOptions> {
  return {
    codeSection:
      (!cliOpts?.noCode && configOptions?.codeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.codeSection!,
    deprecated: (
      (cliOpts?.deprecated ??
        configOptions?.deprecated ??
        DEFAULT_OPTIONS.printTypeOptions.deprecated!) as string
    ).toLocaleLowerCase() as TypeDeprecatedOption,
    parentTypePrefix:
      (!cliOpts?.noParentType && configOptions?.parentTypePrefix) ??
      DEFAULT_OPTIONS.printTypeOptions.parentTypePrefix!,
    relatedTypeSection:
      (!cliOpts?.noRelatedType && configOptions?.relatedTypeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.relatedTypeSection!,
    typeBadges:
      (!cliOpts?.noTypeBadges && configOptions?.typeBadges) ??
      DEFAULT_OPTIONS.printTypeOptions.typeBadges!,
  } as Required<ConfigPrintTypeOptions>;
}

export function parseGroupByOption(
  groupOptions: unknown,
): Maybe<GroupByDirectiveOptions> {
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
  } = parsedOptions.groups as unknown as GroupByDirectiveOptions;
  return { directive, field, fallback } as GroupByDirectiveOptions;
}

export async function buildConfig(
  configFileOpts: Maybe<ConfigOptions>,
  cliOpts: Maybe<CliOptions>,
  id: Maybe<string> = "default",
): Promise<Options> {
  if (!cliOpts) {
    cliOpts = {};
  }

  const graphqlConfig = await loadConfiguration(id);
  const config: ConfigOptions = {
    ...DEFAULT_OPTIONS,
    ...graphqlConfig,
    ...configFileOpts,
  } as const;

  const baseURL: string = cliOpts.base ?? config.baseURL;
  const skipDocDirective = getSkipDocDirectives(cliOpts, config);

  return {
    baseURL,
    customDirective: getCustomDirectives(
      config.customDirective,
      skipDocDirective,
    ),
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod, cliOpts.force),
    docOptions: getDocOptions(cliOpts, config.docOptions),
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) ?? config.groupByDirective,
    homepageLocation:
      cliOpts.homepage ?? config.homepage ?? DEFAULT_OPTIONS.homepage,
    id: id ?? DEFAULT_OPTIONS.id,
    linkRoot: cliOpts.link ?? config.linkRoot ?? DEFAULT_OPTIONS.linkRoot,
    loaders: config.loaders,
    outputDir: join(cliOpts.root ?? config.rootPath, baseURL),
    prettify: cliOpts.pretty ?? config.pretty ?? DEFAULT_OPTIONS.pretty,
    printer: (config.printer ?? DEFAULT_OPTIONS.printer)!,
    printTypeOptions: getPrintTypeOptions(cliOpts, config.printTypeOptions),
    schemaLocation: cliOpts.schema ?? config.schema ?? DEFAULT_OPTIONS.schema,
    skipDocDirective,
    tmpDir: cliOpts.tmp ?? config.tmpDir ?? DEFAULT_OPTIONS.tmpDir,
  } as Options;
}
