/**
 * MDX formatting event classes.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  DefaultAction,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MetaOptions,
  TypeLink,
} from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted when formatting a badge.
 *
 * @category Events
 */
export class FormatBadgeEvent extends CancellableEvent {
  /** The badge to format */
  readonly badge: Badge;
  /** The formatted result. Set by event handlers. */
  result?: MDXString;

  constructor(data: {
    badge: Badge;
    result?: MDXString;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.badge = data.badge;
    this.result = data.result;
  }
}

/**
 * Event emitted when formatting an admonition.
 *
 * @category Events
 */
export class FormatAdmonitionEvent extends CancellableEvent {
  /** The admonition to format */
  readonly admonition: AdmonitionType;
  /** Optional metadata for the admonition */
  readonly meta: Maybe<MetaOptions>;
  /** The formatted result. Set by event handlers. */
  result?: MDXString;

  constructor(data: {
    admonition: AdmonitionType;
    meta: Maybe<MetaOptions>;
    result?: MDXString;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.admonition = data.admonition;
    this.meta = data.meta;
    this.result = data.result;
  }
}

/**
 * Event emitted when formatting a bullet point.
 *
 * @category Events
 */
export class FormatBulletEvent extends CancellableEvent {
  /** The text to display next to the bullet */
  readonly text: string;
  /** The formatted result. Set by event handlers. */
  result?: MDXString;

  constructor(data: {
    text?: string;
    result?: MDXString;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.text = data.text ?? "";
    this.result = data.result;
  }
}

/**
 * Event emitted when formatting a collapsible details section.
 *
 * @category Events
 */
export class FormatDetailsEvent extends CancellableEvent {
  /** The collapsible options */
  readonly options: CollapsibleOption;
  /** The formatted result. Set by event handlers. */
  result?: MDXString;

  constructor(data: {
    options: CollapsibleOption;
    result?: MDXString;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.options = data.options;
    this.result = data.result;
  }
}

/**
 * Event emitted when formatting front matter.
 *
 * @category Events
 */
export class FormatFrontmatterEvent extends CancellableEvent {
  /** The front matter options */
  readonly props: Maybe<FrontMatterOptions>;
  /** The formatted front matter as an array of strings */
  readonly formatted: Maybe<string[]>;
  /** The formatted result. Set by event handlers. */
  result?: MDXString;

  constructor(data: {
    props: Maybe<FrontMatterOptions>;
    formatted: Maybe<string[]>;
    result?: MDXString;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.props = data.props;
    this.formatted = data.formatted;
    this.result = data.result;
  }
}

/**
 * Event emitted when formatting a link.
 *
 * @category Events
 */
export class FormatLinkEvent extends CancellableEvent {
  /** The link to format */
  readonly link: TypeLink;
  /** The formatted result. Set by event handlers. */
  result?: TypeLink;

  constructor(data: {
    link: TypeLink;
    result?: TypeLink;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.link = data.link;
    this.result = data.result;
  }
}

/**
 * Event emitted when formatting a named entity.
 *
 * @category Events
 */
export class FormatNameEntityEvent extends CancellableEvent {
  /** The name of the entity */
  readonly name: string;
  /** Optional parent type of the entity */
  readonly parentType: Maybe<string>;
  /** The formatted result. Set by event handlers. */
  result?: MDXString;

  constructor(data: {
    name: string;
    parentType?: Maybe<string>;
    result?: MDXString;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.name = data.name;
    this.parentType = data.parentType;
    this.result = data.result;
  }
}

/**
 * Event emitted when formatting a specified-by link.
 *
 * @category Events
 */
export class FormatSpecifiedByLinkEvent extends CancellableEvent {
  /** The URL of the specification */
  readonly url: string;
  /** The formatted result. Set by event handlers. */
  result?: MDXString;

  constructor(data: {
    url: string;
    result?: MDXString;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.url = data.url;
    this.result = data.result;
  }
}
