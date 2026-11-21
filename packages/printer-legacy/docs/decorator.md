# decorator

Module providing predicate-driven decorators for type pages.

A decorator (declared in the top-level `decorators` option) is selected by a
predicate over the node being printed — by default, every node — and
renders its resolved values through a user callback. There is no built-in
notion of "this decorator's own directive": a directive-driven decorator
selects its nodes with `predicate: hasDirectiveNamed("name")` and reads
that directive's argument values, if any, from `resolve` via
`@graphql-markdown/graphql`'s `getDirectiveFromSchema` combined with
`getTypeDirectiveValues`/`getTypeDirectiveValuesList` — the same public
helpers this module uses internally. A decorator with a title becomes a top-level
section of the type page; one without renders bare content, placed relative
to the built-in sections, or into a named slot such as the heading's
metadata line or a member's description.

## Type Aliases

### ResolvedDecorator

```ts
type ResolvedDecorator = DecoratorDefinition & object;
```

Defined in: [printer-legacy/src/decorator.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/decorator.ts#L42)

**`Internal`**

A decorator, resolved from its declaration under `decorators`.

#### Type Declaration

##### id

```ts
id: string;
```

The decorator id — the key under which it was declared.

## Variables

### getSchemaEntity

```ts
const getSchemaEntity: (type, options) => Maybe<SchemaEntity>;
```

Defined in: graphql/dist/predicate.d.ts:26

Resolves the schema entity kind of the type being printed.

The kind is taken from the print options when the caller knows it, as only
the caller can tell a query from a mutation. It falls back to the type guards
otherwise, which cover every kind but the operations.

#### Parameters

##### type

`unknown`

the GraphQL type being printed.

##### options

`PrintTypeOptions`

the print options in effect.

#### Returns

`Maybe`&lt;`SchemaEntity`&gt;

the schema entity kind, or `undefined` when it cannot be determined.

---

### RESERVED\_SECTION\_NAMES

```ts
const RESERVED_SECTION_NAMES: readonly string[];
```

Defined in: [printer-legacy/src/decorator.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/decorator.ts#L57)

Section/decorator keys owned by the printer, which a decorator cannot claim.

Re-exported from the package root: `@graphql-markdown/core`'s
`getDecoratorsOption` validates against this same list (plus `"__proto__"`,
reserved only there — see that package's own copy of this comment) so the
two entry points, config-file validation and building a decorators map
directly against the printer API, can't silently drift apart on which
names are reserved.

## Functions

### getDecoratorsOrder()

```ts
function getDecoratorsOrder(sectionOrder, options): string[];
```

Defined in: [printer-legacy/src/decorator.ts:363](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/decorator.ts#L363)

Splices the decorators into the built-in section order.

A decorator is placed after or before the section named by its `position`,
and appended last when `position` is absent or names an unknown section.
A decorator using `into` (a named slot outside the page section order — see
DecoratorPosition) is excluded entirely: it is not part of the page
section order and is printed separately, into its slot. Decorators are
placed in declaration order, so a decorator may target a previously placed
one.

#### Parameters

##### sectionOrder

readonly `string`[]

the built-in section order.

##### options

`PrintTypeOptions`

the print options in effect.

#### Returns

`string`[]

the section order including the decorators.

---

### getExampleSectionDefinition()

```ts
function getExampleSectionDefinition(): ResolvedDecorator;
```

Defined in: [printer-legacy/src/decorator.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/decorator.ts#L94)

Builds the example section as a decorator definition.

The example section is a specialized decorator: it is driven by a schema
directive, named by [`printTypeOptions.exampleSection`](https://graphql-markdown.dev/docs/reference/settings#printtypeoptions),
and rendered as a code block.

It resolves its own value rather than gating on a directive by name,
because an example is also derived from the fields of a type carrying no
example directive itself — the directive lookup (which schema directive
name to use, from `printTypeOptions.exampleSection`) belongs to
[printExample](example.md#printexample) alone.

#### Returns

[`ResolvedDecorator`](#resolveddecorator)

the example decorator definition.

#### Example

```ts
const section = getExampleSectionDefinition(options);
const example = printDecorator(type, section, options);
```

---

### printDecorator()

```ts
function printDecorator(type, decorator, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/decorator.ts:214](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/decorator.ts#L214)

Prints a single decorator for a type, as a titled page section.

Reserved ids are filtered by `getDeclaredDecorators`, not here: the built-in
sections are themselves declared with a reserved id.

#### Parameters

##### type

`unknown`

the GraphQL type being printed.

##### decorator

[`ResolvedDecorator`](#resolveddecorator)

the resolved decorator declaration.

##### options

`PrintTypeOptions`

the print options in effect.

#### Returns

`Maybe`&lt;[`PageSection`](events.md#pagesection)&gt;

the rendered page section, or `undefined` when nothing to print.

---

### printDecorators()

```ts
function printDecorators(type, options): PageSections;
```

Defined in: [printer-legacy/src/decorator.ts:291](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/decorator.ts#L291)

Prints every decorator declared in the print options, excluding those
targeting a named slot (`position: { into }`) — those are not part of the
page's section order and are printed separately, into their slot.

Every declared decorator yields an entry, so that composition hooks can
restore one which rendered no content. Decorators with a reserved or
repeated id are dropped.

#### Parameters

##### type

`unknown`

the GraphQL type being printed.

##### options

`PrintTypeOptions`

the print options in effect.

#### Returns

[`PageSections`](events.md#pagesections)

a map of decorator id to rendered section, empty when none is declared.

---

### printSlotDecorators()

```ts
function printSlotDecorators(slot, type, options): string[];
```

Defined in: [printer-legacy/src/decorator.ts:326](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/decorator.ts#L326)

Prints every decorator declared for a named slot (`position: { into: slot }`),
as raw content rather than a page section — used to splice decorator output
into a slot outside the page's section order, such as the metadata line of a
type or field heading, or a member's description.

#### Parameters

##### slot

`string`

the slot name (matches a decorator's `position.into`).

##### type

`unknown`

the GraphQL type being printed.

##### options

`PrintTypeOptions`

the print options in effect.

#### Returns

`string`[]

the rendered content for every decorator targeting `slot`, in
declaration order; empty when none target it or render no content.
