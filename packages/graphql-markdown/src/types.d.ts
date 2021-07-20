export type ParsedNode = {
  arguments?: unknown;
  type: string;
  name: string;
  directives?: unknown;
  defaultValue?: string;
  kind: string;
  description?: string;
  operation: string;
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
