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
 * rooted at `outputDir`, and relative to the working directory unless the
 * configured `rootPath` is itself absolute. An adapter backed by something
 * other than a filesystem can treat them as opaque keys. The one path that sits
 * outside `outputDir` is mdBook's `SUMMARY.md`, which the format requires one
 * level above it: still inside `rootPath`, so keys taken relative to `rootPath`
 * stay within the tree.
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
  /**
   * Reads back a page this adapter wrote, or resolves `undefined` when there is
   * nothing at that path.
   *
   * The formatters that post-process their own output (DocFX, mdBook, MkDocs)
   * read each page back after it is written. A write-only destination can
   * return `undefined`, but the first page that cannot be read back is
   * reported, since post-processing is skipped for the whole run.
   */
  readFile: (filePath: string) => Promise<string | undefined>;
}
