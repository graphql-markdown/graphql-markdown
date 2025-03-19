import type {
  FrontMatterOptions,
  Maybe,
  PrintTypeOptions,
} from "@graphql-markdown/types";
import { formatFrontMatterObject } from "@graphql-markdown/utils";

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
