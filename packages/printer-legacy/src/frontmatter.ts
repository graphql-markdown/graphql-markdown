import type { FrontMatterOptions, Maybe } from "@graphql-markdown/types";
import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_CODE_INDENTATION,
  MARKDOWN_EOL,
} from "./const/strings";

const formatFrontMatterObject = (
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

const formatFrontMatterList = (
  prop: unknown,
  indentation: number = 0,
  prefix: string = "- ",
): string[] => {
  const frontMatter: string[] = [];

  if (!Array.isArray(prop)) {
    return frontMatter;
  }

  const tabs = MARKDOWN_CODE_INDENTATION.repeat(indentation);

  prop.forEach((entry: unknown) => {
    if (typeof entry === "object") {
      frontMatter.push(
        ...formatFrontMatterObject(entry, -1, prefix).map((item) => {
          return `${tabs}${item}`;
        }),
      );
    } else {
      frontMatter.push(`${tabs}- ${entry}`);
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

  const tabs = MARKDOWN_CODE_INDENTATION.repeat(indentation);
  const [key, value] = Object.entries(prop)[0];

  switch (true) {
    case typeof value !== "string" && Array.isArray(value):
      return [
        `${tabs}${prefix ?? ""}${key}:`,
        ...formatFrontMatterList(value, indentation + 1, prefix),
      ];
    case typeof value === "object" && value !== null:
      return [
        `${tabs}${prefix ?? ""}${key}:`,
        ...formatFrontMatterObject(value, indentation, prefix),
      ];
    default:
      return [`${tabs}${prefix ?? ""}${key}: ${value}`];
  }
};

export const printFrontMatter = (
  id: string,
  title: string,
  props?: Maybe<FrontMatterOptions>,
): string => {
  const frontMatter = formatFrontMatterObject(
    props as Record<string, unknown>,
    -1,
  );

  const header = [
    FRONT_MATTER_DELIMITER,
    `id: ${id}`,
    `title: ${title}`,
    ...frontMatter,
    FRONT_MATTER_DELIMITER,
  ];

  return header.join(MARKDOWN_EOL);
};
