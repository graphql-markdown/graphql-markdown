import type { Maybe } from ".";

export type Category = { category: string; slug: string };

export type MDXString = string & { _opaque: typeof MDXString };
declare const MDXString: unique symbol;

export type PrettifyCallbackFunction = (
  text: string,
  options?: unknown,
) => Promise<Maybe<string>>;
