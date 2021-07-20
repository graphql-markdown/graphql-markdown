export type Maybe<T> = T | undefined;

export type ParsedNode = {
  arguments?: unknown;
  type: string;
  name: string;
  directives?: unknown;
  defaultValue?: string;
  kind: string;
  description?: string;
  operation: string;
  markdown?: string;
};

export type Result = {
  type: string;
  name: string;
  markdown?: string;
  filepath?: string;
};

// mock type
// https://github.com/kamilkisiela/graphql-config/blob/master/src/extension.ts
export interface ExtensionAPI {
  logger: unknown;
  loaders: {
    schema: {
      register: (args: unknown) => unknown;
    };
    documents: unknown;
  };
}

export interface LoadConfigOptions {
  filepath?: string;
  rootDir?: string;
  extensions?: unknown;
  throwOnMissing?: boolean;
  throwOnEmpty?: boolean;
  configName?: string;
  legacy?: boolean;
}

export { generateMarkdownFromSchema } from "./lib/generator";
