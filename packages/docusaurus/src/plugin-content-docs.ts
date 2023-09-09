import * as PluginContentDocs from "@docusaurus/plugin-content-docs";
import type { PluginModule } from "@docusaurus/types";

const plugin: PluginModule & { default?: PluginModule } =
  PluginContentDocs as PluginModule & { default?: PluginModule };

export const pluginContentDocs = plugin.default ? plugin.default : plugin;
export const validateOptions = plugin.default?.validateOptions
  ? plugin.default.validateOptions
  : plugin.validateOptions;
