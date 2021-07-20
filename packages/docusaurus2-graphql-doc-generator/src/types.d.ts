export type PluginOptions = {
  baseURL: string;
  homepage: string;
  id?: string;
  linkRoot: string;
  schema: string;
  rootPath: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Sidebar = Record<string, any>;
