import { join } from "node:path";
import { tmpdir } from "node:os";

import type {
  CliOptions,
  ConfigDocOptions,
  ConfigOptions,
  ConfigPrintTypeOptions,
  CustomDirective,
  DeprecatedCliOptions,
  DeprecatedConfigDocOptions,
  DeprecatedConfigPrintTypeOptions,
  DirectiveName,
  FrontMatterOptions,
  GroupByDirectiveOptions,
  Maybe,
  Options,
  PackageName,
  Pointer,
  TypeDeprecatedOption,
  TypeDiffMethod,
  TypeHierarchyObjectType,
  TypeHierarchyType,
  TypeHierarchyValueType,
} from "@graphql-markdown/types";

import { loadConfiguration } from "./graphql-config";

export enum TypeHierarchy {
  API = "api",
  ENTITY = "entity",
  FLAT = "flat",
}

export enum DiffMethod {
  NONE = "NONE",
  FORCE = "FORCE",
}

export enum DeprecatedOption {
  DEFAULT = "default",
  GROUP = "group",
  SKIP = "skip",
}

export const DOCS_URL = "https://graphql-markdown.dev/docs" as const;
export const PACKAGE_NAME = "@graphql-markdown/docusaurus" as const;
export const ASSET_HOMEPAGE_LOCATION = join(
  __dirname,
  "..",
  "assets",
  "generated.md",
);

export const DEFAULT_HIERARCHY = { [TypeHierarchy.API]: {} };

export const DEFAULT_OPTIONS: Readonly<
  Pick<ConfigOptions, "customDirective" | "groupByDirective" | "loaders"> &
    Required<
      Omit<
        ConfigOptions,
        "customDirective" | "groupByDirective" | "loaders" | "printTypeOptions"
      >
    >
> & {
  printTypeOptions: Required<Omit<ConfigPrintTypeOptions, "hierarchy">> & {
    hierarchy: Required<Pick<TypeHierarchyObjectType, TypeHierarchy.API>>;
  };
} = {
  id: "default" as const,
  baseURL: "schema" as const,
  customDirective: undefined,
  diffMethod: DiffMethod.NONE as TypeDiffMethod,
  docOptions: {
    frontMatter: {} as FrontMatterOptions,
    index: false as const,
  } as Required<
    Pick<ConfigDocOptions & DeprecatedConfigDocOptions, "frontMatter" | "index">
  >,
  force: false as const,
  groupByDirective: undefined,
  homepage: ASSET_HOMEPAGE_LOCATION,
  linkRoot: "/" as const,
  loaders: undefined,
  metatags: [] as Record<string, string>[],
  pretty: false as const,
  printer: "@graphql-markdown/printer-legacy" as PackageName,
  printTypeOptions: {
    codeSection: true as const,
    deprecated: DeprecatedOption.DEFAULT as TypeDeprecatedOption,
    exampleSection: false as const,
    parentTypePrefix: true as const,
    relatedTypeSection: true as const,
    typeBadges: true as const,
  } as Required<Omit<ConfigPrintTypeOptions, "hierarchy">> & {
    hierarchy: Required<Pick<TypeHierarchyObjectType, TypeHierarchy.API>>;
  },
  rootPath: "./docs" as const,
  schema: "./schema.graphql" as Pointer,
  tmpDir: join(tmpdir(), PACKAGE_NAME),
  skipDocDirective: [] as DirectiveName[],
  onlyDocDirective: [] as DirectiveName[],
} as const;

export const getDocDirective = (name: Maybe<DirectiveName>): DirectiveName => {
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
};

export const getOnlyDocDirectives = (
  cliOpts: Maybe<CliOptions>,
  configFileOpts: Maybe<Pick<ConfigOptions, "onlyDocDirective">>,
): DirectiveName[] => {
  const directiveList: DirectiveName[] = [].concat(
    (cliOpts?.only ?? []) as never[],
    (configFileOpts?.onlyDocDirective ?? []) as never[],
  );

  const onlyDirectives = directiveList.map((directiveName) => {
    return getDocDirective(directiveName);
  });

  return onlyDirectives;
};

export const getSkipDocDirectives = (
  cliOpts: Maybe<CliOptions>,
  configFileOpts: Maybe<
    Pick<ConfigOptions, "printTypeOptions" | "skipDocDirective">
  >,
): DirectiveName[] => {
  const directiveList: DirectiveName[] = [].concat(
    (cliOpts?.skip ?? []) as never[],
    (configFileOpts?.skipDocDirective ?? []) as never[],
  );

  const skipDirectives = directiveList.map((directiveName) => {
    return getDocDirective(directiveName);
  });

  if (
    (configFileOpts &&
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      configFileOpts.printTypeOptions?.deprecated === DeprecatedOption.SKIP) ||
    (cliOpts && cliOpts.deprecated === DeprecatedOption.SKIP)
  ) {
    skipDirectives.push("deprecated" as DirectiveName);
  }

  return skipDirectives;
};

export const getVisibilityDirectives = (
  cliOpts: Maybe<CliOptions>,
  configFileOpts: Maybe<
    Pick<
      ConfigOptions,
      "onlyDocDirective" | "printTypeOptions" | "skipDocDirective"
    >
  >,
): { onlyDocDirective: DirectiveName[]; skipDocDirective: DirectiveName[] } => {
  const skipDocDirective = getSkipDocDirectives(cliOpts, configFileOpts);
  const onlyDocDirective = getOnlyDocDirectives(cliOpts, configFileOpts);

  if (
    onlyDocDirective.some((directiveName) => {
      return skipDocDirective.includes(directiveName);
    })
  ) {
    throw new Error(
      "The same directive cannot be declared in 'onlyDocDirective' and 'skipDocDirective'.",
    );
  }

  return { onlyDocDirective, skipDocDirective };
};

export const getCustomDirectives = (
  customDirectiveOptions: Maybe<CustomDirective>,
  skipDocDirective?: Maybe<DirectiveName[]>,
): Maybe<CustomDirective> => {
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
};

export const getDiffMethod = (
  diff: TypeDiffMethod,
  force: boolean = false,
): TypeDiffMethod => {
  return force
    ? DiffMethod.FORCE
    : (diff.toLocaleUpperCase() as TypeDiffMethod);
};

export const parseDeprecatedDocOptions = (
  _cliOpts: Maybe<Omit<DeprecatedCliOptions, "never">>,
  _configOptions: Maybe<Omit<DeprecatedConfigDocOptions, "never">>,
): Record<string, never> => {
  return {};
};

export const getDocOptions = (
  cliOpts?: Maybe<CliOptions & Omit<DeprecatedCliOptions, "never">>,
  configOptions?: Maybe<
    ConfigDocOptions & Omit<DeprecatedConfigDocOptions, "never">
  >,
): Required<ConfigDocOptions> => {
  const deprecated = parseDeprecatedDocOptions(cliOpts, configOptions);
  const index =
    typeof cliOpts?.index === "boolean"
      ? cliOpts.index
      : typeof configOptions?.index === "boolean"
        ? configOptions.index
        : DEFAULT_OPTIONS.docOptions!.index;
  return {
    frontMatter: {
      ...deprecated,
      ...configOptions?.frontMatter,
    },
    index,
  } as Required<ConfigDocOptions>;
};

export const getTypeHierarchyOption = (
  cliOption?: Maybe<TypeHierarchyValueType>,
  configOption?: Maybe<TypeHierarchyType>,
): Maybe<TypeHierarchyObjectType> => {
  const parseValue = (
    config?: Maybe<TypeHierarchyType>,
  ): Maybe<TypeHierarchyObjectType> => {
    if (typeof config === "string") {
      switch (true) {
        case new RegExp(`^${TypeHierarchy.ENTITY}$`, "i").test(config):
          return { [TypeHierarchy.ENTITY]: {} };
        case new RegExp(`^${TypeHierarchy.FLAT}$`, "i").test(config):
          return { [TypeHierarchy.FLAT]: {} };
        case new RegExp(`^${TypeHierarchy.API}$`, "i").test(config):
          return { [TypeHierarchy.API]: {} };
        default:
          return undefined;
      }
    }
    return config;
  };

  const toStringHierarchy = (
    hierarchy: Maybe<TypeHierarchyObjectType>,
  ): Maybe<TypeHierarchyValueType> => {
    return hierarchy && (Object.keys(hierarchy)[0] as TypeHierarchyValueType);
  };

  const cliHierarchy = parseValue(cliOption);
  const configHierarchy = parseValue(configOption);

  if (cliHierarchy && configHierarchy) {
    const strCliHierarchy = toStringHierarchy(cliHierarchy);
    const strConfigHierarchy = toStringHierarchy(configHierarchy);
    if (strCliHierarchy !== strConfigHierarchy) {
      throw new Error(
        `Hierarchy option mismatch in CLI flag '${strCliHierarchy}' and config '${strConfigHierarchy}'`,
      );
    }
  }

  return cliHierarchy ?? configHierarchy ?? DEFAULT_HIERARCHY;
};

export const parseDeprecatedPrintTypeOptions = (
  _cliOpts: Maybe<Omit<DeprecatedCliOptions, "never">>,
  _configOptions: Maybe<Omit<DeprecatedConfigPrintTypeOptions, "never">>,
): Record<string, never> => {
  return {};
};

export const getPrintTypeOptions = (
  cliOpts: Maybe<CliOptions & Omit<DeprecatedCliOptions, "never">>,
  configOptions: Maybe<
    ConfigPrintTypeOptions & Omit<DeprecatedConfigPrintTypeOptions, "never">
  >,
): Required<ConfigPrintTypeOptions> => {
  const deprecated = parseDeprecatedPrintTypeOptions(cliOpts, configOptions);
  return {
    ...deprecated,
    codeSection:
      (!cliOpts?.noCode && configOptions?.codeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.codeSection,
    deprecated: (
      (cliOpts?.deprecated ??
        configOptions?.deprecated ??
        DEFAULT_OPTIONS.printTypeOptions.deprecated) as string
    ).toLocaleLowerCase() as TypeDeprecatedOption,
    exampleSection:
      (!cliOpts?.noExample && configOptions?.exampleSection) ??
      DEFAULT_OPTIONS.printTypeOptions.exampleSection,
    parentTypePrefix:
      (!cliOpts?.noParentType && configOptions?.parentTypePrefix) ??
      DEFAULT_OPTIONS.printTypeOptions.parentTypePrefix,
    relatedTypeSection:
      (!cliOpts?.noRelatedType && configOptions?.relatedTypeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.relatedTypeSection,
    typeBadges:
      (!cliOpts?.noTypeBadges && configOptions?.typeBadges) ??
      DEFAULT_OPTIONS.printTypeOptions.typeBadges,
    hierarchy: getTypeHierarchyOption(
      cliOpts?.hierarchy,
      configOptions?.hierarchy,
    ),
  } as Required<ConfigPrintTypeOptions>;
};

export const parseGroupByOption = (
  groupOptions: unknown,
): Maybe<GroupByDirectiveOptions> => {
  const DEFAULT_GROUP = "Miscellaneous";
  const OPTION_REGEX =
    /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

  if (typeof groupOptions !== "string") {
    return undefined;
  }

  const parsedOptions = OPTION_REGEX.exec(groupOptions);

  if (typeof parsedOptions === "undefined" || parsedOptions === null) {
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
};

export const buildConfig = async (
  configFileOpts: Maybe<ConfigOptions>,
  cliOpts?: Maybe<CliOptions>,
  id: Maybe<string> = "default",
): Promise<Options> => {
  if (!cliOpts) {
    cliOpts = {};
  }

  const graphqlConfig = await loadConfiguration(id);
  const config: ConfigOptions = {
    ...DEFAULT_OPTIONS,
    ...graphqlConfig,
    ...configFileOpts,
  } as const;

  const baseURL: string = cliOpts.base ?? config.baseURL!;
  const { onlyDocDirective, skipDocDirective } = getVisibilityDirectives(
    cliOpts,
    config,
  );

  const force = cliOpts.force ?? config.force ?? DEFAULT_OPTIONS.force;

  return {
    baseURL,
    customDirective: getCustomDirectives(
      config.customDirective,
      skipDocDirective,
    ),
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod!, force),
    docOptions: getDocOptions(cliOpts, config.docOptions),
    force,
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) ?? config.groupByDirective,
    homepageLocation:
      cliOpts.homepage ?? config.homepage ?? DEFAULT_OPTIONS.homepage,
    id: id ?? DEFAULT_OPTIONS.id,
    linkRoot: cliOpts.link ?? config.linkRoot ?? DEFAULT_OPTIONS.linkRoot,
    loaders: config.loaders,
    metatags: config.metatags ?? DEFAULT_OPTIONS.metatags,
    onlyDocDirective,
    outputDir: join(cliOpts.root ?? config.rootPath!, baseURL),
    prettify: cliOpts.pretty ?? config.pretty ?? DEFAULT_OPTIONS.pretty,
    printer: (config.printer ?? DEFAULT_OPTIONS.printer)!,
    printTypeOptions: getPrintTypeOptions(cliOpts, config.printTypeOptions),
    schemaLocation: cliOpts.schema ?? config.schema ?? DEFAULT_OPTIONS.schema,
    skipDocDirective,
    tmpDir: cliOpts.tmp ?? config.tmpDir ?? DEFAULT_OPTIONS.tmpDir,
  } as Options;
};
