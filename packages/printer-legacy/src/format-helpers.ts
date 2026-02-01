/**
 * Format event helpers for printer-legacy.
 *
 * This module provides helper functions to emit MDX format events and handle
 * fallback to default formatters when no custom handlers are registered.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MetaOptions,
  TypeLink,
} from "@graphql-markdown/types";

import { getEvents } from "@graphql-markdown/core";
import {
  FormatEvents,
  FormatBadgeEvent,
  FormatAdmonitionEvent,
  FormatBulletEvent,
  FormatDetailsEvent,
  FormatFrontmatterEvent,
  FormatLinkEvent,
  FormatNameEntityEvent,
  FormatSpecifiedByLinkEvent,
} from "@graphql-markdown/core";

// Import default formatters
import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "./const/strings";

/**
 * Default badge formatter.
 */
const formatMDXBadge = (badge: Badge): MDXString => {
  return `<mark class="gqlmd-mdx-badge">${badge.text as string}</mark>` as MDXString;
};

/**
 * Default admonition formatter.
 */
const formatMDXAdmonition = (
  { text, title, type, icon }: AdmonitionType,
  _meta: Maybe<MetaOptions>,
): MDXString => {
  return `${MARKDOWN_EOP}<fieldset class="gqlmd-mdx-admonition-fieldset">${MARKDOWN_EOL}<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLocaleLowerCase()}">${icon ?? type.toUpperCase()} ${title}</span></legend>${MARKDOWN_EOL}<span>${text}</span>${MARKDOWN_EOL}</fieldset>` as MDXString;
};

/**
 * Default bullet formatter.
 */
const formatMDXBullet = (text = ""): MDXString => {
  return `<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>${text}` as MDXString;
};

/**
 * Default details formatter.
 */
const formatMDXDetails = ({ dataOpen }: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<details class="gqlmd-mdx-details">${MARKDOWN_EOL}<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">${dataOpen.toUpperCase()}</span></summary>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Default frontmatter formatter.
 */
const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  return formatted
    ? ([FRONT_MATTER_DELIMITER, ...formatted, FRONT_MATTER_DELIMITER].join(
        MARKDOWN_EOL,
      ) as MDXString)
    : ("" as MDXString);
};

/**
 * Default link formatter.
 */
const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
};

/**
 * Default name entity formatter.
 */
const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType
    ? `<code class="gqlmd-mdx-entity-parent">${parentType}</code>.`
    : "";
  return `<span class="gqlmd-mdx-entity">${parentName}<code class="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
};

/**
 * Default specified-by link formatter.
 */
const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="${url}" title="Specified by ${url}">⎘</a></span>` as MDXString;
};

/**
 * Emits a FORMAT_BADGE event and returns the formatted result or default.
 *
 * @param badge - The badge to format
 * @returns Formatted badge as MDXString
 */
export const emitFormatBadgeEvent = async (
  badge: Badge,
): Promise<MDXString> => {
  const event = new FormatBadgeEvent({ badge });
  await getEvents().emitAsync(FormatEvents.FORMAT_BADGE, event);
  return event.result ?? formatMDXBadge(badge);
};

/**
 * Emits a FORMAT_ADMONITION event and returns the formatted result or default.
 *
 * @param admonition - The admonition to format
 * @param meta - Optional metadata
 * @returns Formatted admonition as MDXString
 */
export const emitFormatAdmonitionEvent = async (
  admonition: AdmonitionType,
  meta: Maybe<MetaOptions>,
): Promise<MDXString> => {
  const event = new FormatAdmonitionEvent({ admonition, meta });
  await getEvents().emitAsync(FormatEvents.FORMAT_ADMONITION, event);
  return event.result ?? formatMDXAdmonition(admonition, meta);
};

/**
 * Emits a FORMAT_BULLET event and returns the formatted result or default.
 *
 * @param text - Optional text to display next to the bullet
 * @returns Formatted bullet as MDXString
 */
export const emitFormatBulletEvent = async (
  text?: string,
): Promise<MDXString> => {
  const event = new FormatBulletEvent({ text });
  await getEvents().emitAsync(FormatEvents.FORMAT_BULLET, event);
  return event.result ?? formatMDXBullet(text);
};

/**
 * Emits a FORMAT_DETAILS event and returns the formatted result or default.
 *
 * @param options - The collapsible options
 * @returns Formatted details as MDXString
 */
export const emitFormatDetailsEvent = async (
  options: CollapsibleOption,
): Promise<MDXString> => {
  const event = new FormatDetailsEvent({ options });
  await getEvents().emitAsync(FormatEvents.FORMAT_DETAILS, event);
  return event.result ?? formatMDXDetails(options);
};

/**
 * Emits a FORMAT_FRONTMATTER event and returns the formatted result or default.
 *
 * @param props - The frontmatter options
 * @param formatted - The formatted frontmatter array
 * @returns Formatted frontmatter as MDXString
 */
export const emitFormatFrontmatterEvent = async (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): Promise<MDXString> => {
  const event = new FormatFrontmatterEvent({ props, formatted });
  await getEvents().emitAsync(FormatEvents.FORMAT_FRONTMATTER, event);
  return event.result ?? formatMDXFrontmatter(props, formatted);
};

/**
 * Emits a FORMAT_LINK event and returns the formatted result or default.
 *
 * @param link - The link to format
 * @returns Formatted link as TypeLink
 */
export const emitFormatLinkEvent = async (
  link: TypeLink,
): Promise<TypeLink> => {
  const event = new FormatLinkEvent({ link });
  await getEvents().emitAsync(FormatEvents.FORMAT_LINK, event);
  return event.result ?? formatMDXLink(link);
};

/**
 * Emits a FORMAT_NAME_ENTITY event and returns the formatted result or default.
 *
 * @param name - The entity name
 * @param parentType - Optional parent type
 * @returns Formatted name entity as MDXString
 */
export const emitFormatNameEntityEvent = async (
  name: string,
  parentType?: Maybe<string>,
): Promise<MDXString> => {
  const event = new FormatNameEntityEvent({ name, parentType });
  await getEvents().emitAsync(FormatEvents.FORMAT_NAME_ENTITY, event);
  return event.result ?? formatMDXNameEntity(name, parentType);
};

/**
 * Emits a FORMAT_SPECIFIED_BY_LINK event and returns the formatted result or default.
 *
 * @param url - The specification URL
 * @returns Formatted specified-by link as MDXString
 */
export const emitFormatSpecifiedByLinkEvent = async (
  url: string,
): Promise<MDXString> => {
  const event = new FormatSpecifiedByLinkEvent({ url });
  await getEvents().emitAsync(FormatEvents.FORMAT_SPECIFIED_BY_LINK, event);
  return event.result ?? formatMDXSpecifiedByLink(url);
};
