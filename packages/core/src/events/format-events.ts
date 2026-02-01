/**
 * MDX formatting event constants.
 *
 * @packageDocumentation
 */

/**
 * Event names for MDX formatting lifecycle.
 */
export const FormatEvents = {
  /** Emitted when formatting a badge */
  FORMAT_BADGE: "format:badge",
  /** Emitted when formatting an admonition */
  FORMAT_ADMONITION: "format:admonition",
  /** Emitted when formatting a bullet point */
  FORMAT_BULLET: "format:bullet",
  /** Emitted when formatting a collapsible details section */
  FORMAT_DETAILS: "format:details",
  /** Emitted when formatting front matter */
  FORMAT_FRONTMATTER: "format:frontmatter",
  /** Emitted when formatting a link */
  FORMAT_LINK: "format:link",
  /** Emitted when formatting a named entity */
  FORMAT_NAME_ENTITY: "format:nameEntity",
  /** Emitted when formatting a specified-by link */
  FORMAT_SPECIFIED_BY_LINK: "format:specifiedByLink",
} as const;
