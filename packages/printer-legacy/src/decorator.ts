/**
 * Module providing predicate-driven decorators for type pages.
 *
 * A decorator (declared in the top-level `decorators` option) is selected by a
 * predicate over the node being printed — by default, every node — and
 * renders its resolved values through a user callback. There is no built-in
 * notion of "this decorator's own directive": a directive-driven decorator
 * selects its nodes with `predicate: hasDirectiveNamed("name")` and reads
 * that directive's argument values, if any, from `resolve` via
 * `@graphql-markdown/graphql`'s `getDirectiveFromSchema` combined with
 * `getTypeDirectiveValues`/`getTypeDirectiveValuesList` — the same public
 * helpers this module uses internally. A decorator with a title becomes a top-level
 * section of the type page; one without renders bare content, placed relative
 * to the built-in sections, or into a named slot such as the heading's
 * metadata line or a member's description.
 *
 * @packageDocumentation
 */

import type {
  DecoratorContext,
  DecoratorDefinition,
  Maybe,
  PageSection,
  PageSections,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import { always, getSchemaEntity } from "@graphql-markdown/graphql";

import { printExample } from "./example.ts";

import { MARKDOWN_EOP, printCodeBlock } from "./const/strings.ts";

export { getSchemaEntity };

/**
 * A decorator, resolved from its declaration under `decorators`.
 *
 * @internal
 */
export type ResolvedDecorator = DecoratorDefinition & {
  /** The decorator id — the key under which it was declared. */
  id: string;
};

/**
 * Section/decorator keys owned by the printer, which a decorator cannot claim.
 *
 * Re-exported from the package root: `@graphql-markdown/core`'s
 * `getDecoratorsOption` validates against this same list (plus `"__proto__"`,
 * reserved only there — see that package's own copy of this comment) so the
 * two entry points, config-file validation and building a decorators map
 * directly against the printer API, can't silently drift apart on which
 * names are reserved.
 */
export const RESERVED_SECTION_NAMES: readonly string[] = [
  "header",
  "metatags",
  "mdxDeclaration",
  "title",
  "tags",
  "description",
  "code",
  "metadata",
  "example",
  "relations",
] as const;

/**
 * Builds the example section as a decorator definition.
 *
 * The example section is a specialized decorator: it is driven by a schema
 * directive, named by [`printTypeOptions.exampleSection`](https://graphql-markdown.dev/docs/reference/settings#printtypeoptions),
 * and rendered as a code block.
 *
 * It resolves its own value rather than gating on a directive by name,
 * because an example is also derived from the fields of a type carrying no
 * example directive itself — the directive lookup (which schema directive
 * name to use, from `printTypeOptions.exampleSection`) belongs to
 * {@link printExample} alone.
 *
 * @param options - the print options in effect.
 *
 * @returns the example decorator definition.
 *
 * @example
 * ```ts
 * const section = getExampleSectionDefinition(options);
 * const example = printDecorator(type, section, options);
 * ```
 *
 */
export const getExampleSectionDefinition = (): ResolvedDecorator => {
  return {
    id: "example",
    title: "Example",
    resolve: (
      type: unknown,
      printOptions: PrintTypeOptions,
    ): Record<string, unknown>[] => {
      const example = printExample(type, printOptions);
      return example ? [{ example }] : [];
    },
    render: (values: Record<string, unknown>[]): string => {
      return printCodeBlock(values[0]!.example as string);
    },
  };
};

/**
 * Resolves the values a decorator renders, applying the marker-decorator
 * substitution rule.
 *
 * `undefined` means "skip this decorator": either its resolver returned a
 * non-array, or it resolved no values with nothing asking for the
 * marker-decorator substitution below. A decorator with an explicit
 * `predicate` and no `resolve` renders once, with an empty record, whenever
 * its predicate matches — a pure marker decorator, useful for a directive
 * whose mere presence is the content (see the module doc for how to also
 * gate on, and read, a specific directive). A `resolve` returning `[]` is
 * never ambiguous with that case — it means "nothing to render this time"
 * — so it is not substituted; nor is the no-`predicate`-no-`resolve` case,
 * which is a no-op by construction (`predicate` defaults to matching every
 * node, `resolve` to producing nothing).
 *
 * @internal
 */
const resolveDecoratorValues = (
  type: unknown,
  decorator: ResolvedDecorator,
  options: PrintTypeOptions,
): Maybe<Record<string, unknown>[]> => {
  const resolved = decorator.resolve ? decorator.resolve(type, options) : [];

  if (!Array.isArray(resolved)) {
    return undefined;
  }

  if (resolved.length === 0) {
    return !decorator.predicate || decorator.resolve ? undefined : [{}];
  }

  return resolved;
};

/**
 * Resolves and renders a single decorator's raw content for a type.
 *
 * The decorator is skipped, returning `undefined`, when its predicate does
 * not match, no value is resolved for it, or the render callback returns no
 * content. Shared by {@link printDecorator}
 * (which wraps this into a titled page section) and {@link printSlotDecorators}
 * (which collects this raw content for a named slot, such as the metadata line).
 *
 * @internal
 *
 * @param type - the GraphQL type being printed.
 * @param decorator - the resolved decorator declaration.
 * @param options - the print options in effect.
 *
 * @returns the decorator's rendered content, or `undefined` when nothing to print.
 *
 */
const renderDecoratorContent = (
  type: unknown,
  decorator: ResolvedDecorator,
  options: PrintTypeOptions,
): Maybe<string> => {
  if (typeof decorator.render !== "function") {
    return undefined;
  }

  const predicate = decorator.predicate ?? always();

  if (!predicate(type, options)) {
    return undefined;
  }

  const values = resolveDecoratorValues(type, decorator, options);

  if (values === undefined || values === null) {
    return undefined;
  }

  const context: DecoratorContext = {
    id: decorator.id,
    type,
    entity: getSchemaEntity(type, options),
  };

  const content = decorator.render(values, options, context);

  if (typeof content !== "string" || content.trim().length === 0) {
    return undefined;
  }

  return content;
};

/**
 * Prints a single decorator for a type, as a titled page section.
 *
 * Reserved ids are filtered by `getDeclaredDecorators`, not here: the built-in
 * sections are themselves declared with a reserved id.
 *
 * @param type - the GraphQL type being printed.
 * @param decorator - the resolved decorator declaration.
 * @param options - the print options in effect.
 *
 * @returns the rendered page section, or `undefined` when nothing to print.
 *
 */
export const printDecorator = (
  type: unknown,
  decorator: ResolvedDecorator,
  options: PrintTypeOptions,
): Maybe<PageSection> => {
  const content = renderDecoratorContent(type, decorator, options);

  if (content === undefined) {
    return undefined;
  }

  return {
    title: decorator.title ?? undefined,
    // The render callback owns its Markdown: trimming here would alter content
    // whose leading whitespace is significant, such as an indented code block.
    content: `${content}${MARKDOWN_EOP}`,
    level: decorator.level ?? 3,
  };
};

/**
 * Returns the decorators to build, in declaration order, from the top-level
 * `decorators` option.
 *
 *
 * @internal
 *
 * @param options - the print options in effect.
 *
 * @returns the decorators to build.
 *
 */
const getDeclaredDecorators = (
  options: PrintTypeOptions,
): ResolvedDecorator[] => {
  const decorators =
    typeof options.decorators === "object" && options.decorators !== null
      ? options.decorators
      : undefined;

  return decorators
    ? Object.entries(decorators)
        .filter(([id]): boolean => {
          return !RESERVED_SECTION_NAMES.includes(id);
        })
        .map(([id, decorator]): ResolvedDecorator => {
          return { ...decorator, id };
        })
    : [];
};

/**
 * Checks whether a decorator targets a named slot (`position: { into }`)
 * rather than the page's section order.
 *
 * @internal
 */
const targetsSlot = (decorator: ResolvedDecorator): boolean => {
  const position = decorator.position;
  return !!position && typeof position === "object" && "into" in position;
};

/**
 * Prints every decorator declared in the print options, excluding those
 * targeting a named slot (`position: { into }`) — those are not part of the
 * page's section order and are printed separately, into their slot.
 *
 * Every declared decorator yields an entry, so that composition hooks can
 * restore one which rendered no content. Decorators with a reserved or
 * repeated id are dropped.
 *
 * @param type - the GraphQL type being printed.
 * @param options - the print options in effect.
 *
 * @returns a map of decorator id to rendered section, empty when none is declared.
 *
 */
export const printDecorators = (
  type: unknown,
  options: PrintTypeOptions,
): PageSections => {
  // Null-prototype map: a decorator named `__proto__` would otherwise reach the
  // prototype setter of an object literal and never become an own property.
  // An object literal cannot declare that key, but the printer is also reachable
  // directly, with a declaration built any other way.
  const sections = Object.create(null) as PageSections;

  getDeclaredDecorators(options)
    .filter((decorator): boolean => {
      return !targetsSlot(decorator);
    })
    .forEach((decorator): void => {
      sections[decorator.id] = printDecorator(type, decorator, options);
    });

  return sections;
};

/**
 * Prints every decorator declared for a named slot (`position: { into: slot }`),
 * as raw content rather than a page section — used to splice decorator output
 * into a slot outside the page's section order, such as the metadata line of a
 * type or field heading, or a member's description.
 *
 * @param slot - the slot name (matches a decorator's `position.into`).
 * @param type - the GraphQL type being printed.
 * @param options - the print options in effect.
 *
 * @returns the rendered content for every decorator targeting `slot`, in
 * declaration order; empty when none target it or render no content.
 *
 */
export const printSlotDecorators = (
  slot: string,
  type: unknown,
  options: PrintTypeOptions,
): string[] => {
  return getDeclaredDecorators(options)
    .filter((decorator): boolean => {
      return (
        targetsSlot(decorator) &&
        (decorator.position as { into: string }).into === slot
      );
    })
    .map((decorator): Maybe<string> => {
      return renderDecoratorContent(type, decorator, options);
    })
    .filter((content): content is string => {
      return typeof content === "string";
    });
};

/**
 * Splices the decorators into the built-in section order.
 *
 * A decorator is placed after or before the section named by its `position`,
 * and appended last when `position` is absent or names an unknown section.
 * A decorator using `into` (a named slot outside the page section order — see
 * {@link DecoratorPosition}) is excluded entirely: it is not part of the page
 * section order and is printed separately, into its slot. Decorators are
 * placed in declaration order, so a decorator may target a previously placed
 * one.
 *
 * @param sectionOrder - the built-in section order.
 * @param options - the print options in effect.
 *
 * @returns the section order including the decorators.
 *
 */
export const getDecoratorsOrder = (
  sectionOrder: readonly string[],
  options: PrintTypeOptions,
): string[] => {
  return getDeclaredDecorators(options)
    .filter((decorator): boolean => {
      return !targetsSlot(decorator);
    })
    .reduce(
      (order: string[], decorator: ResolvedDecorator): string[] => {
        const position = decorator.position;
        const anchor = position
          ? (position.after ?? position.before)
          : undefined;
        const index = anchor ? order.indexOf(anchor) : -1;

        if (index === -1) {
          order.push(decorator.id);
          return order;
        }

        order.splice(position?.after ? index + 1 : index, 0, decorator.id);
        return order;
      },
      [...sectionOrder],
    );
};
