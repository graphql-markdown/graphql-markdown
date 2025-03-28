/**
 * Module for handling frontmatter generation in Markdown documents.
 * Provides utilities for formatting and printing frontmatter content.
 * @module
 */
import type {
  FrontMatterOptions,
  Maybe,
  PrintTypeOptions,
} from "@graphql-markdown/types";
import { formatFrontMatterObject } from "@graphql-markdown/utils";

/**
 * Generates a formatted frontmatter string for Markdown/MDX documents.
 *
 * @param title - The title to be included in the frontmatter
 * @param props - Additional frontmatter properties to be included
 * @param options - Configuration options for printing
 * @returns Formatted frontmatter string, or empty string if formatting is disabled
 */
export const printFrontMatter = (
  title: string,
  props: Maybe<FrontMatterOptions>,
  options: PrintTypeOptions,
): string => {
  const frontMatter = formatFrontMatterObject({ ...props, title }, -1);

  if (!options.formatMDXFrontmatter) {
    return "";
  }

  return options.formatMDXFrontmatter(props, frontMatter) as string;
};
