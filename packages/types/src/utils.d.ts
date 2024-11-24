export type Maybe<T> = T | null | undefined;

export interface Category {
  category: string;
  slug: string;
}

export type MDXString = string & { _opaque: typeof MDX_STRING };
declare const MDX_STRING: unique symbol;

export type PrettifyCallbackFunction = (
  text: string,
  options?: unknown,
) => Promise<Maybe<string>>;

export type EnsureDirOptions = Maybe<{ forceEmpty?: boolean }>;
