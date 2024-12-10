import type { FrontMatterOptions, Maybe } from "@graphql-markdown/types";
import { toString } from "@graphql-markdown/utils";
import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_CODE_INDENTATION,
  MARKDOWN_EOL,
} from "./const/strings";

const tabs = (indentation: number = 0): string => {
  return MARKDOWN_CODE_INDENTATION.repeat(indentation);
};

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

  const tabs = MARKDOWN_CODE_INDENTATION.repeat(indentation);
  const [key, value] = Object.entries(prop)[0];
  const index = `${tabs}${prefix ?? ""}${key}:`;

  switch (true) {
    case typeof value !== "string" && Array.isArray(value):
      return [index, ...formatFrontMatterList(value, indentation + 1, prefix)];
    case typeof value === "object" && value !== null:
      return [index, ...formatFrontMatterObject(value, indentation, prefix)];
    default:
      return [`${index} ${value}`];
  }
};

export const printFrontMatter = (
  id: string,
  title: string,
  props?: Maybe<FrontMatterOptions>,
): string => {
  const frontMatter = formatFrontMatterObject({ ...props, id, title }, -1);

  const header = [
    FRONT_MATTER_DELIMITER,
    ...frontMatter,
    FRONT_MATTER_DELIMITER,
  ];

  return header.join(MARKDOWN_EOL);
};
