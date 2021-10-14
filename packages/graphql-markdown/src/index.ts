export type Maybe<T> = T | undefined;

export type ParsedNode = {
  arguments?: unknown;
  defaultValue?: string;
  description?: string;
  directives?: unknown;
  kind: string;
  markdown?: string;
  name: string;
  operation: string;
  simplifiedKind: string;
  type: string;
};

export type Result = {
  filepath?: string;
  markdown?: string;
  name: string;
  type: string;
};

// mock type
// https://github.com/kamilkisiela/graphql-config/blob/master/src/extension.ts
export interface ExtensionAPI {
  loaders: {
    documents: unknown;
    schema: {
      register: (args: unknown) => unknown;
    };
  };
  logger: unknown;
}

export interface LoadConfigOptions {
  configName?: string;
  extensions?: unknown;
  filepath?: string;
  legacy?: boolean;
  rootDir?: string;
  throwOnMissing?: boolean;
  throwOnEmpty?: boolean;
}

type ClassName = string; // UrlLoader

type ModuleName = string; // "@graphql-tools/url-loader"

export type Loaders = {
  [className: ClassName]: ModuleName
}

export type ConfigurationOptions = {
  excludes?: readonly string[];
  layouts?: string;
  mdx?: boolean;
  output?: string;
  loaders?: Loaders
};

export { generateMarkdownFromSchema } from "./lib/generator";
