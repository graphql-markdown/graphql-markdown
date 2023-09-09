import type { PluginOptions } from "@docusaurus/plugin-content-docs";
import type { OptionValidationContext } from "@docusaurus/types";

import type { ConfigOptions } from "@graphql-markdown/types";

import { validateOptions as validateOptionPlugin } from "./plugin-content-docs";

export const DEFAULT_ID = "default" as const;

export type Options = ConfigOptions &
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  PluginOptions & { runOnBuild?: boolean };

export const getNativePluginOptions = (options: Options): PluginOptions => {
  const mappedOptions: Options = {
    ...options,
    path: options.rootPath,
    routeBasePath: options.linkRoot,
  };

  const pluginOptions = Object.fromEntries(
    Object.entries(mappedOptions).filter(([key]) => {
      return [
        "id",
        "path",
        "routeBasePath",
        "tagsBasePath",
        "include",
        "exclude",
        "sidebarItemsGenerator",
        "numberPrefixParser",
        "docsRootComponent",
        "docVersionRootComponent",
        "docRootComponent",
        "docItemComponent",
        "docTagDocListComponent",
        "docTagsListComponent",
        "docCategoryGeneratedIndexComponent",
        "remarkPlugins",
        "rehypePlugins",
        "beforeDefaultRemarkPlugins",
        "beforeDefaultRehypePlugins",
        "showLastUpdateTime",
        "showLastUpdateAuthor",
        "admonitions",
        "includeCurrentVersion",
        "disableVersioning",
        "lastVersion",
        "versions",
        "editCurrentVersion",
        "editLocalizedFiles",
        "sidebarCollapsible",
        "sidebarCollapsed",
        "sidebarPath",
        "breadcrumbs",
      ].includes(key);
    }),
  );

  return pluginOptions as PluginOptions;
};

export const validateOptions = ({
  validate,
  options,
}: OptionValidationContext<Options, Options>): Options => {
  const userOptions = options;

  userOptions.id = options.id ? options.id : DEFAULT_ID;

  if (!validateOptionPlugin) {
    return userOptions;
  }

  const normalizedOptions = validateOptionPlugin<PluginOptions, PluginOptions>({
    validate,
    options: getNativePluginOptions(userOptions),
  });

  return { ...userOptions, ...normalizedOptions } as Options;
};
