/**
 * Module providing predicate-driven decorators for type pages.
 *
 * A decorator (declared in the top-level `decorators` option) is selected by a
 * predicate over the node being printed — by default, "the node carries the
 * directive named after this decorator" — and renders its resolved values
 * through a user callback. A decorator with a title becomes a top-level
 * section of the type page; one without renders bare content, placed relative
 * to the built-in sections, or into a named slot such as the heading's
 * metadata line or a member's description.
 *
 * `customDirective` is the deprecated predecessor of this module. It never
 * reaches this module, or any other part of the printer: `@graphql-markdown/core`
 * converts its schema-resolved directive map into decorator declarations
 * (see {@link buildCustomDirectiveDecorators}) once, before the printer is
 * ever invoked, so both options flow through the exact same resolve/render
 * pipeline below — there is one code path for "select nodes by directive,
 * render descriptor text, a badge, or a section", not two.
 *
 * @packageDocumentation
 */

import type {
  Badge,
  CustomDirectiveMap,
  CustomDirectiveMapItem,
  CustomDirectiveResolver,
  DecoratorContext,
  DecoratorDefinition,
  Decorators,
  DecoratorPredicate,
  DecoratorResolver,
  DirectiveName,
  Maybe,
  PageSection,
  PageSections,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import {
  always,
  and,
  getConstDirectiveMap,
  getDirectiveFromSchema,
  getSchemaEntity,
  getTypeDirectiveValuesList,
  hasDirectiveNamed,
  isEntity,
} from "@graphql-markdown/graphql";

import { escapeMDX } from "@graphql-markdown/utils";

import { formatBadges } from "./badge";
import { printExample } from "./example";
import { printLink } from "./link";

import {
  MARKDOWN_EOC,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  MARKDOWN_SOC,
} from "./const/strings";
import { SectionLevels } from "./const/options";

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
  "tags",
  "description",
  "code",
  "customDirectives",
  "metadata",
  "example",
  "relations",
] as const;

/**
 * Resolves a custom directive handler's return value.
 *
 * Internal to {@link buildCustomDirectiveDecorators}'s render closures; not
 * itself user-facing — see `ConfigOptions.customDirective` for the setting.
 *
 * @param resolver - The resolver function name to execute
 * @param type - The GraphQL type to resolve the directive for
 * @param constDirectiveOption - The directive configuration options
 * @param fallback - Optional fallback value if resolution fails
 * @returns The resolved directive value or `fallback`/`undefined`
 *
 * @internal
 */
const getCustomDirectiveResolver = (
  resolver: CustomDirectiveResolver,
  type: unknown,
  constDirectiveOption: CustomDirectiveMapItem,
  fallback?: Maybe<string>,
): Maybe<string> => {
  if (
    typeof constDirectiveOption.type !== "object" ||
    typeof constDirectiveOption[resolver] !== "function"
  ) {
    return fallback;
  }

  return constDirectiveOption[resolver]!(
    constDirectiveOption.type,
    type,
  ) as Maybe<string>;
};

/**
 * Prints a single custom directive entry as a Markdown string, for the
 * built-in "Directives" section.
 *
 * @internal
 */
const printCustomDirective = (
  type: unknown,
  constDirectiveOption: CustomDirectiveMapItem,
  options: PrintTypeOptions,
): Maybe<string> => {
  const typeNameLink = printLink(constDirectiveOption.type, {
    ...options,
    withAttributes: false,
  });
  const description = getCustomDirectiveResolver(
    "descriptor",
    type,
    constDirectiveOption,
  );

  if (typeof description !== "string") {
    return undefined;
  }

  return `${SectionLevels.LEVEL.repeat(4)} ${typeNameLink}${MARKDOWN_EOL} ${description}${MARKDOWN_EOL} `;
};

/**
 * Converts the deprecated `customDirective` option's schema-resolved
 * directive map into decorator declarations, so it flows through the exact
 * same resolve/render pipeline as everything declared under `decorators`.
 *
 * Called once by `@graphql-markdown/core`, right after `customDirectives` is
 * schema-resolved — `customDirective`/`CustomDirectiveMap` never reach this
 * printer package otherwise; only the three decorators built here do, via
 * `PrintTypeOptions.customDirectiveDecorators`.
 *
 * Returns three entries, merged unconditionally by `getDeclaredDecorators`
 * (ahead of `decorators`, bypassing its reserved-id filter — these ids,
 * including the reserved `customDirectives`, are assigned here, not by user
 * config):
 * - `customDirectives`: the built-in "Directives" section, listing every
 *   custom directive declared on a type, positioned right after `code`
 *   (its fixed position in the pre-decorators built-in section order).
 * - `customDirective:description`: `customDirective`'s `descriptor`
 *   handlers, appended as description text (`position: { into: "description" }`).
 * - `customDirective:tags`: `customDirective`'s `tag` handlers, rendered as
 *   badges in the metadata line (`position: { into: "tags" }`).
 *
 * All three share one `resolve`, reading every custom directive matched on
 * a node, in schema declaration order. Matching (including wildcard `"*"`
 * precedence — a named handler wins over `"*"`) is already resolved by
 * `getConstDirectiveMap` (fed by `@graphql-markdown/graphql`'s
 * `getCustomDirectives`, which expands a wildcard into concrete
 * per-directive entries upstream), so this reuses that resolution rather
 * than re-implementing it against the generic predicate system.
 *
 * @param customDirectives - the schema-resolved `customDirective` map, or
 * `undefined`/empty when the option is not in use.
 *
 * @returns the three decorators, or `{}` when `customDirectives` is empty.
 *
 */
export const buildCustomDirectiveDecorators = (
  customDirectives: Maybe<CustomDirectiveMap>,
): Decorators => {
  if (
    typeof customDirectives !== "object" ||
    customDirectives === null ||
    Object.keys(customDirectives).length === 0
  ) {
    return {};
  }

  const resolve: DecoratorResolver = (
    type: unknown,
  ): Record<string, unknown>[] => {
    const constDirectiveMap = getConstDirectiveMap(type, customDirectives);

    return constDirectiveMap
      ? (Object.values(constDirectiveMap) as unknown as Record<
          string,
          unknown
        >[])
      : [];
  };

  return {
    customDirectives: {
      title: "Directives",
      predicate: always(),
      resolve,
      position: { after: "code" },
      render: (values, options, context): Maybe<string> => {
        const directives = (values as unknown as CustomDirectiveMapItem[])
          .map((item): Maybe<string> => {
            return printCustomDirective(context.type, item, options);
          })
          .filter((value): value is string => {
            return value !== undefined;
          });

        return directives.length > 0
          ? directives.join(MARKDOWN_EOP)
          : undefined;
      },
    },
    "customDirective:description": {
      predicate: always(),
      resolve,
      position: { into: "description" },
      render: (values, _options, context): Maybe<string> => {
        const parts = (values as unknown as CustomDirectiveMapItem[])
          .map((item): Maybe<string> => {
            return getCustomDirectiveResolver(
              "descriptor",
              context.type,
              item,
              "",
            );
          })
          .filter((text): text is string => {
            return typeof text === "string" && text.length > 0;
          })
          .map((text): string => {
            return escapeMDX(text);
          });

        return parts.length > 0 ? parts.join(MARKDOWN_EOP) : undefined;
      },
    },
    "customDirective:tags": {
      predicate: always(),
      resolve,
      position: { into: "tags" },
      render: (values, options, context): Maybe<string> => {
        const badges = (values as unknown as CustomDirectiveMapItem[])
          .map((item): Maybe<string> => {
            return getCustomDirectiveResolver("tag", context.type, item);
          })
          .filter((value): value is string => {
            return value !== undefined;
          }) as unknown as Badge[];

        return badges.length > 0
          ? (formatBadges(badges, options) as string)
          : undefined;
      },
    },
  };
};

/**
 * Builds the predicate for a decorator's (deprecated) `appliesTo` filter.
 *
 * A decorator without `appliesTo` applies everywhere. A decorator with
 * `appliesTo` is skipped when the entity kind is unknown, as the narrowing
 * cannot be honoured — matching `isEntity`, which this is built from.
 *
 * `appliesTo` is documented as sugar for composing `isEntity(...)` with
 * `predicate` via `and()`; this is that composition, not a second, parallel
 * gating mechanism alongside the predicate pipeline.
 *
 * @internal
 *
 * @param decorator - the decorator declaration.
 *
 * @returns a predicate true when `appliesTo` is absent, or the type's entity
 * kind is one of `appliesTo`.
 *
 */
const appliesToPredicate = (
  decorator: Pick<DecoratorDefinition, "appliesTo">,
): DecoratorPredicate => {
  if (!Array.isArray(decorator.appliesTo) || decorator.appliesTo.length === 0) {
    return always();
  }

  return isEntity(...decorator.appliesTo);
};

/**
 * Builds the example section as a decorator definition.
 *
 * The example section is a specialized decorator: it is driven by a schema
 * directive, named by [`printTypeOptions.exampleSection`](https://graphql-markdown.dev/docs/settings#printtypeoptions),
 * and rendered as a code block.
 *
 * It resolves its own value rather than reading directive occurrences,
 * because an example is also derived from the fields of a type carrying no
 * example directive itself — so it must not be gated on that directive's
 * presence on the type (see {@link printDecorator}'s predicate default).
 * The `directive` name is therefore descriptive only: the schema lookup
 * belongs to {@link printExample}.
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
export const getExampleSectionDefinition = (
  options: PrintTypeOptions,
): ResolvedDecorator => {
  const { exampleSection } = options;
  // Matches `getDirectiveExampleOption`: an empty directive name falls back too.
  const directive =
    exampleSection &&
    typeof exampleSection === "object" &&
    exampleSection.directive
      ? exampleSection.directive
      : "example";

  return {
    id: "example",
    title: "Example",
    directive: directive as DirectiveName,
    resolve: (
      type: unknown,
      printOptions: PrintTypeOptions,
    ): Record<string, unknown>[] => {
      const example = printExample(type, printOptions);
      return example ? [{ example }] : [];
    },
    render: (values: Record<string, unknown>[]): string => {
      return `${MARKDOWN_SOC}${values[0]!.example as string}${MARKDOWN_EOC}`;
    },
  };
};

/**
 * Builds the predicate gating a decorator.
 *
 * A decorator with a custom `resolve` is gated only by its own return value,
 * matching the pre-existing behaviour of a custom-section resolver (most
 * notably the built-in Example section, whose values may come from a field
 * nested arbitrarily deep rather than from the type itself, and the
 * `customDirective`-adapter decorators above, whose matching is driven by
 * `options.customDirectives`, not the decorator's own id/directive). Only
 * the default, directive-occurrences path is gated on directive presence.
 *
 * `appliesTo` is composed in via `and()` rather than checked separately: it
 * is sugar for `isEntity(...)` combined with `predicate`, not a second,
 * parallel gating mechanism (see `appliesToPredicate`).
 *
 * @internal
 */
const resolveDecoratorPredicate = (
  decorator: ResolvedDecorator,
  directiveName: string,
): DecoratorPredicate => {
  return and(
    decorator.predicate ??
      (decorator.resolve ? always() : hasDirectiveNamed(directiveName)),
    appliesToPredicate(decorator),
  );
};

/**
 * Resolves the values a decorator renders, applying the marker-decorator
 * substitution rule.
 *
 * `undefined` means "skip this decorator": either its resolver returned a
 * non-array, or it resolved no values with nothing asking for the
 * marker-decorator substitution below. An explicit `predicate`, using the
 * default directive-occurrences resolver, with no resolved values is a pure
 * marker decorator (no directive arguments to carry): it still renders once,
 * with an empty record. A custom `resolve` returning `[]` is never
 * ambiguous with that case — it means "nothing to render this time" — so it
 * is not substituted.
 *
 * @internal
 */
const resolveDecoratorValues = (
  type: unknown,
  decorator: ResolvedDecorator,
  directive: ReturnType<typeof getDirectiveFromSchema>,
  options: PrintTypeOptions,
): Maybe<Record<string, unknown>[]> => {
  let resolved: unknown;
  if (decorator.resolve) {
    resolved = decorator.resolve(type, options);
  } else if (directive) {
    resolved = getTypeDirectiveValuesList(directive, type);
  } else {
    resolved = [];
  }

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
 * The decorator is skipped, returning `undefined`, when its `appliesTo` filter
 * excludes the type, its predicate does not match, no value is resolved for
 * it, or the render callback returns no content. Shared by {@link printDecorator}
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

  const directiveName = decorator.directive ?? decorator.id;
  // Resolved once and reused below for both the default resolve path and the
  // render context, rather than looked up twice.
  const directive = getDirectiveFromSchema(directiveName, options);

  if (!resolveDecoratorPredicate(decorator, directiveName)(type, options)) {
    return undefined;
  }

  const values = resolveDecoratorValues(type, decorator, directive, options);

  if (values === undefined || values === null) {
    return undefined;
  }

  const context: DecoratorContext = {
    id: decorator.id,
    type,
    directive,
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
 * Returns the decorators to build, in declaration order: `customDirective`'s
 * adapter decorators (see {@link buildCustomDirectiveDecorators}; always
 * present, each skips silently when it matches nothing) followed by every
 * entry declared under the top-level `decorators` option. Only the latter is
 * filtered against reserved ids: the adapter's ids are assigned by the
 * converter, not user config, and the printer is reachable directly through
 * its public API, bypassing configuration validation, so a user-declared
 * decorator claiming a reserved id must still be dropped rather than
 * overwrite a built-in section.
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

  const declared = decorators
    ? Object.entries(decorators)
        .filter(([id]): boolean => {
          return !RESERVED_SECTION_NAMES.includes(id);
        })
        .map(([id, decorator]): ResolvedDecorator => {
          return { ...decorator, id };
        })
    : [];

  const customDirectiveDecorators =
    typeof options.customDirectiveDecorators === "object" &&
    options.customDirectiveDecorators !== null
      ? options.customDirectiveDecorators
      : undefined;

  const adapter = customDirectiveDecorators
    ? Object.entries(customDirectiveDecorators).map(
        ([id, decorator]): ResolvedDecorator => {
          return { ...decorator, id };
        },
      )
    : [];

  return [...adapter, ...declared];
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
