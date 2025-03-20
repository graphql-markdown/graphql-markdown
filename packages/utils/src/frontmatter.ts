import { toString } from "./string";

const tabs = (indentation: number = 0): string => {
  return "  ".repeat(indentation);
};

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
