/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AdmonitionType,
  Badge,
  Maybe,
  MDXString,
  MDXSupportType,
  MetaOptions,
  PackageName,
} from "@graphql-markdown/types";

import { MARKDOWN_EOL, MARKDOWN_EOP } from "../const/strings";

import { log, LogLevel } from "@graphql-markdown/logger";

const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  return `<mark class="gqlmd-mdx-badge">${text as string}</mark>` as MDXString;
};

const formatMDXAdmonition = (
  { text, title, type, icon }: AdmonitionType,
  meta: Maybe<MetaOptions>,
): MDXString => {
  return `${MARKDOWN_EOP}<fieldset class="gqlmd-mdx-admonition-fieldset">${MARKDOWN_EOL}<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLocaleLowerCase()}">${icon ?? type.toUpperCase()}</span> **${title}**</legend>${MARKDOWN_EOL}<span>${text}</span>${MARKDOWN_EOL}</fieldset>` as MDXString;
};

const formatMDXBullet = (text: string = ""): MDXString => {
  return `<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>${text}` as MDXString;
};

const formatMDXDetails = ({
  dataOpen,
}: {
  dataOpen: Maybe<string>;
  dataClose: Maybe<string>;
}): MDXString => {
  return `${MARKDOWN_EOP}<details class="gqlmd-mdx-details">${MARKDOWN_EOL}<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">${dataOpen?.toUpperCase()}</span></summary>${MARKDOWN_EOP}\r${MARKDOWN_EOP}</details>${MARKDOWN_EOP}` as MDXString;
};

const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="${url}" title="Specified by ${url}">⎘</a></span>` as MDXString;
};

const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType
    ? `<code class="gqlmd-mdx-entity-parent">${parentType}.</code>`
    : "";
  return `<span class="gqlmd-mdx-entity">${parentName}<code class="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
};

export const mdxDeclaration = "";

const defaultModule = {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxDeclaration,
  mdxSupport: false,
} as MDXSupportType;

export const mdxModule = async (
  mdxPackage?: Maybe<PackageName>,
): Promise<Readonly<MDXSupportType>> => {
  if (!mdxPackage) {
    return defaultModule;
  }
  return import(mdxPackage)
    .then((_module: Record<string, unknown>) => {
      const module = (_module.default ?? _module) as Record<string, unknown>;
      return {
        formatMDXAdmonition: module.formatMDXAdmonition ?? formatMDXAdmonition,
        formatMDXBadge: module.formatMDXBadge ?? formatMDXBadge,
        formatMDXBullet: module.formatMDXBullet ?? formatMDXBullet,
        formatMDXDetails: module.formatMDXDetails ?? formatMDXDetails,
        formatMDXNameEntity: module.formatMDXNameEntity ?? formatMDXNameEntity,
        formatMDXSpecifiedByLink:
          module.formatMDXSpecifiedByLink ?? formatMDXSpecifiedByLink,
        mdxDeclaration: module.mdxDeclaration ?? mdxDeclaration,
        mdxSupport: true,
      } as MDXSupportType;
    })
    .catch(() => {
      log(
        `An error occurred while loading MDX formatter "${mdxPackage}"`,
        LogLevel.warn,
      );
      return defaultModule;
    });
};

export default defaultModule;
