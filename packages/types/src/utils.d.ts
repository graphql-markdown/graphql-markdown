export type Maybe<T> = T | null | undefined;

export interface Category {
  category: string;
  filePath: string;
  name: string;
}

export type MDXString = string & { _opaque: typeof MDX_STRING };
declare const MDX_STRING: unique symbol;

export type PrettifyCallbackFunction = (
  text: string,
  options?: unknown,
) => Promise<Maybe<string>>;

export type EnsureDirOptions = Maybe<{ forceEmpty?: boolean }>;

/**
 * Destination for generated documentation.
 *
 * The default implementation writes to the local filesystem. Supplying a custom
 * adapter redirects every generated page to another target - a CMS storage API,
 * an in-memory map, an object store - without forking the renderer.
 *
 * Paths passed to an adapter are the same ones the filesystem writer would use:
 * absolute, rooted at `outputDir`. An adapter backed by something other than a
 * filesystem can treat them as opaque keys.
 */
export interface OutputAdapter {
  /**
   * Persists a generated page. Called once per type page, plus once for the
   * homepage. Implementations must overwrite an existing entry.
   */
  writeFile: (filePath: string, content: string) => Promise<void>;
  /**
   * Prepares a directory before writing into it. Optional: targets without a
   * directory concept can omit it. `forceEmpty` asks for existing content to be
   * discarded first, which backs the `force` option.
   */
  ensureDir?: (
    dirPath: string,
    options?: EnsureDirOptions,
  ) => Promise<void>;
}
