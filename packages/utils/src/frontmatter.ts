import { toString } from "./string";

/**
 * Generates a string of repeated tab characters based on the given indentation level.
 *
 * @param indentation - The number of indentation levels. Defaults to 0.
 * @returns A string containing repeated tab characters.
 *
 * @example
 * ```typescript
 * tabs(2); // "    "
 * tabs(0); // ""
 * ```
 */
const tabs = (indentation: number = 0): string => {
  return "  ".repeat(indentation);
};

/**
 * Formats an object into a front matter YAML-like structure as string array.
 *
 * @param props - The object to format.
 * @param indentation - The current indentation level. Defaults to 0.
 * @param prefix - An optional prefix for each line.
 * @returns An array of strings representing the formatted front matter.
 *
 * @example
 * ```typescript
 * const obj = { title: "My Title", tags: ["tag1", "tag2"] };
 * formatFrontMatterObject(obj);
 * // [
 * //   "  title: My Title",
 * //   "  tags:",
 * //   "    - tag1",
 * //   "    - tag2"
 * // ]
 * ```
 */
export const formatFrontMatterObject = (
  props: unknown,
  indentation: number = 0,
  prefix?: string,
): string[] => {
  const frontMatter: string[] = [];

  if (!props || typeof props !== "object") {
    return frontMatter;
  }

  for (const [key, value] of Object.entries(props)) {
    frontMatter.push(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      ...formatFrontMatterProp({ [key]: value }, indentation + 1, prefix),
    );
    prefix = " ".repeat(prefix?.length ?? 0);
  }

  return frontMatter;
};

/**
 * Formats an array into a front matter YAML-like structure as string array.
 *
 * @param prop - The array to format.
 * @param indentation - The current indentation level. Defaults to 0.
 * @param prefix - The prefix for each list item. Defaults to "- ".
 * @returns An array of strings representing the formatted front matter list.
 *
 * @example
 * ```typescript
 * const list = ["item1", "item2"];
 * formatFrontMatterList(list);
 * // [
 * //   "- item1",
 * //   "- item2"
 * // ]
 * ```
 */
export const formatFrontMatterList = (
  prop: unknown,
  indentation: number = 0,
  prefix: string = "- ",
): string[] => {
  const frontMatter: string[] = [];

  if (!Array.isArray(prop)) {
    return frontMatter;
  }

  prop.forEach((entry: unknown) => {
    if (typeof entry === "object") {
      frontMatter.push(
        ...formatFrontMatterObject(entry, -1, prefix).map((item) => {
          return `${tabs(indentation)}${item}`;
        }),
      );
    } else {
      frontMatter.push(`${tabs(indentation)}- ${toString(entry)}`);
    }
  });

  return frontMatter;
};

/**
 * Formats a single property into a front matter YAML-like structure as string array.
 *
 * @param prop - The property to format, represented as an object with a single key-value pair.
 * @param indentation - The current indentation level. Defaults to 0.
 * @param prefix - An optional prefix for the property.
 * @returns An array of strings representing the formatted front matter property.
 *
 * @example
 * ```typescript
 * const prop = { title: "My Title" };
 * formatFrontMatterProp(prop);
 * // [
 * //   "title: My Title"
 * // ]
 * ```
 */
export const formatFrontMatterProp = (
  prop: unknown,
  indentation: number = 0,
  prefix?: string,
): string[] => {
  if (typeof prop === "undefined" || prop === null) {
    return [];
  }

  const [key, value] = Object.entries(prop)[0];
  const index = `${tabs(indentation)}${prefix ?? ""}${key}:`;

  switch (true) {
    case typeof value !== "string" && Array.isArray(value):
      return [index, ...formatFrontMatterList(value, indentation + 1, prefix)];
    case typeof value === "object" && value !== null:
      return [index, ...formatFrontMatterObject(value, indentation, prefix)];
    default:
      return [`${index} ${value}`];
  }
};
